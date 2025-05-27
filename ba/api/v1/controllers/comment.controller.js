const Photo = require("../models/photo.model");
const Comment = require("../models/comment.model");
const mongoose = require("mongoose");

// POST /api/v1/comments/:photoId
exports.addCommentToPhoto = async (req, res) => {
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
exports.getCommentsByPhoto = async (req, res) => {
  try {
    const photoId = req.params.photoId;

    const comments = await Comment.find({
      photo_id: photoId,
    })
      .populate({ path: "user_id", select: "-password" })
      .sort({ date_time: -1 });

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
