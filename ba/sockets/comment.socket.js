const Comment = require("../api/v1/models/comment.model");

module.exports = async (req, res) => {
    const userId = res.user.id;
    const photoId = req.params.photoId;

    _io.once("connection", (socket) => {
        socket.join(`photo_${photoId}`);

        socket.on("CLIENT_SEND_COMMENT", async (content) => {
            // Lưu vào database
            const comment = new Comment({
                user_id: userId,
                photo_id: photoId,
                comment: content,
            });
            await comment.save();

            // Populate user data
            const populatedComment = await Comment.findById(comment._id)
                .populate({
                    path: "user_id",
                    select: "first_name last_name username"
                });

            // Trả data về client
            _io.to(`photo_${photoId}`).emit("SERVER_RETURN_COMMENT", {
                _id: populatedComment._id,
                comment: populatedComment.comment,
                date_time: populatedComment.date_time,
                user_id: populatedComment.user_id,
                photo_id: populatedComment.photo_id,
                likeLength: 0,
                isLiked: false
            });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected:", socket.id);
        });
    });
}