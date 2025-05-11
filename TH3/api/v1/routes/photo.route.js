const express = require('express');
const router = express.Router();

const User = require('../models/user.model');
const Photo = require('../models/photo.model');

// GET /api/v1/photos/:user_id
router.get('/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  try {
    // Kiểm tra người dùng có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const photos = await Photo.find({ user_id: userId });

    const result = [];

    // Duyệt qua từng ảnh
    for (const photo of photos) {
      const formattedComments = [];

      // Duyệt qua từng comment trong ảnh
      for (const comment of photo.comments) {
        const commenter = await User.findById(comment.user_id).select('_id first_name last_name');

        formattedComments.push({
          _id: comment._id,
          comment: comment.comment,
          date_time: comment.date_time,
          user: commenter
        });
      }

      // Thêm ảnh đã định dạng vào kết quả
      result.push({
        _id: photo._id,
        user_id: photo.user_id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        comments: formattedComments
      });
    }

    res.json(result);
  } catch (err) {
    console.error('Error retrieving photos:', err);
    res.status(500).json({ error: 'Server error retrieving photos' });
  }
});

module.exports = router;
