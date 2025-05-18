const Photo = require("../models/photo.model");
const Comment = require("../models/comment.model");

// POST /api/v1/comments/:photoId
exports.addCommentToPhoto = async (req, res) => {
  try {
    const { comment, user_id } = req.body;
    const photo = await Photo.findById(req.params.photoId);
    if (!photo) return res.status(404).json({ message: "Photo not found" });

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
