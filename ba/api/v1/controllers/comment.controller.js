const Photo = require("../models/photo.model");
const Comment = require("../models/comment.model");
const commentSocket = require("../../../sockets/comment.socket");

// POST /api/v1/comments/:photoId
module.exports.addCommentToPhoto = async (req, res) => {
  try {
    const photoId = req.params.photoId;

    // commentSocket(req, res);

    const { comment, parentCommentId } = req.body;
    const user_id = req.user?.id;

    const photo = await Photo.findById(photoId);
    if (!photo) {
      return res.status(404).json({ code: 404, message: "Không tìm thấy ảnh" });
    }

    const newComment = new Comment({
      comment,
      user_id: user_id,
      photo_id: photo._id,
      parent_comment_id: parentCommentId || null,
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
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: err.message,
    });
  }
};

// GET /api/v1/comments/:photoId
module.exports.getCommentsByPhoto = async (req, res) => {
  try {
    const photoId = req.params.photoId;
    const userId = req.user?.id;

    const comments = await Comment.find({
      photo_id: photoId,
      parent_comment_id: null,
    })
      .select("-__v")
      .populate({
        path: "user_id",
        select: "_id first_name last_name username",
      })
      .sort({ date_time: -1 });

    const result = comments.map((comment) => {
      const isLiked = comment.like.some(
        (like) => like.user_id.toString() === userId
      );

      return {
        _id: comment._id,
        comment: comment.comment,
        date_time: comment.date_time,
        user_id: comment.user_id,
        photo_id: comment.photo_id,
        likeLength: comment.like.length,
        idLiked: isLiked,
        parent_comment_id: comment.parent_comment_id,
      };
    });

    res.status(200).json({
      code: 200,
      message: "Lấy bình luận thành công",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      error: err.message,
    });
  }
};

// GET /api/v1/comments/:commentId/replies
module.exports.getRepliesByComment = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const userId = req.user?.id;

    const replies = await Comment.find({
      parent_comment_id: commentId,
    })
      .select("-__v")
      .populate({
        path: "user_id",
        select: "_id first_name last_name username",
      })
      .sort({ date_time: -1 });

    const result = replies.map((reply) => {
      const isLiked = reply.like.some(
        (like) => like.user_id.toString() === userId
      );

      return {
        _id: reply._id,
        comment: reply.comment,
        date_time: reply.date_time,
        user_id: reply.user_id,
        photo_id: reply.photo_id,
        likeLength: reply.like.length,
        idLiked: isLiked,
        parent_comment_id: reply.parent_comment_id,
      };
    });

    res.status(200).json({
      code: 200,
      message: "Lấy phản hồi thành công",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      error: err.message,
    });
    return;
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

// POST /api/v1/comments/:commentId/like
module.exports.likeComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?.id;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy bình luận",
      });
    }

    const alreadyLiked = comment.like.some(
      (like) => like.user_id.toString() === userId
    );

    if (alreadyLiked) {
      return res.status(400).json({
        code: 400,
        message: "Bạn đã thích bình luận này rồi",
      });
    }

    await Comment.updateOne(
      { _id: commentId },
      { $push: { like: { user_id: userId } } }
    );

    const updateComment = await Comment.findById(commentId);

    res.status(200).json({
      code: 200,
      message: "Thích bình luận thành công",
      result: updateComment,
    });
  } catch (error) {
    res.status(500).json({ code: 500, error: error.message });
  }
};
