const Photo = require("../models/photo.model");
const Comment = require("../models/comment.model");

// POST /api/v1/comments/:photoId
exports.addCommentToPhoto = async (req, res) => {
  try {
    const { comment, user_id } = req.body;
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).json({ message: "Không tìm thấy ảnh" });

    const newComment = new Comment({ comment, user_id, photo_id: photo._id });
    const savedComment = await newComment.save();

    photo.comments.push(savedComment._id);
    await photo.save();

    const populated = await savedComment
      .populate("user_id", "username avatar")
      .execPopulate();
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// GET /api/v1/comments/:photoId
exports.getCommentsByPhoto = async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const comments = await Comment.find({ photo_id: photoId });

    console.log(comments);

    if (!comments.length) {
      return res
        .status(404)
        .json({ code: 404, message: "không có bình luận cho ảnh này." });
    }

    res.status(200).json({
      code: 200,
      message: "Lấy bình luận thành công",
      result: comments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
