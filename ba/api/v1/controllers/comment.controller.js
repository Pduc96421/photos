const Photo = require("../models/photo.model");
const Comment = require("../models/comment.model");

// POST /api/v1/comments/:photoId
module.exports.addCommentToPhoto = async (req, res) => {
  try {
    const { comment } = req.body;
    const photoId = req.params.photoId;
    const user_id = req.user?.id;

    if (!comment || !user_id) {
      return res.status(400).json({
        code: 400,
        message: "Thiếu nội dung bình luận hoặc thông tin người dùng",
      });
    }

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ code: 404, message: "Không tìm thấy ảnh" });
    }

    const newComment = new Comment({
      comment,
      user_id: user_id,
      photo_id: photo._id,
    });
    const savedComment = await newComment.save();

    photo.comments.push(savedComment._id);
    await photo.save();

    const populatedComment = await Comment.findById(savedComment._id).populate({
      path: "user_id",
      select: "-password",
    });

    res.status(200).json({
      code: 200,
      message: "Thêm bình luận thành công",
      result: populatedComment,
    });
  } catch (err) {
    res
      .status(500)
      .json({ code: 500, message: "Lỗi server", error: err.message });
  }
};

// GET /api/v1/comments/:photoId
module.exports.getCommentsByPhoto = async (req, res) => {
  try {
    const photoId = req.params.photoId;

    const comments = await Comment.find({
      photo_id: photoId,
    })
      .populate({ path: "user_id", select: "-password" })
      .sort({ date_time: -1 });

    res.status(200).json({
      code: 200,
      message: "Lấy bình luận thành công",
      result: comments,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE //api/v1/comments/:commentId
module.exports.deleteComment = async (req, res) => {
  const commentId = req.params.commentId;
  const userId = req.user?.id;

  const comment = await Comment.findOne({
    _id: commentId,
  });

  if (!comment) {
    res.status(401).json({
      code: 401,
      message: "Không tìm thấy bình luận",
    });
    return;
  }

  if (comment.user_id.toString() !== userId) {
    res.status(403).json({
      code: 403,
      message: "Bạn không có quyền xóa",
    });
    return;
  }

  const photo = await Photo.findOne({ _id: comment.photo_id });

  if (photo) {
    photo.comments = photo.comments.filter(
      (commentId) => commentId.toString() !== comment._id.toString()
    );
    await photo.save();
  }

  await Comment.deleteOne({ _id: commentId });

  res.status(200).json({
    code: 200,
    message: "Xóa bình luận thành công",
    result: [],
  });
};
