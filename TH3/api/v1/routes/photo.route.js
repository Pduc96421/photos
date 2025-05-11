const express = require("express");
const router = express.Router();

const User = require("../models/user.model");
const Photo = require("../models/photo.model");

// GET /api/v1/photo/user/:id
router.get("/user/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(400).send({ error: "Invalid user ID" });

    const photos = await Photo.find({ user_id: req.params.id });

    const result = await Promise.all(photos.map(async (photo) => {
      const comments = await Promise.all(photo.comments.map(async (cmt) => {
        const commentUser = await User.findById(cmt.user_id).select("_id first_name last_name");
        return {
          _id: cmt._id,
          comment: cmt.comment,
          date_time: cmt.date_time,
          user: commentUser
        };
      }));

      return {
        _id: photo._id,
        user_id: photo.user_id,
        file_name: photo.file_name,
        date_time: photo.date_time,
        comments
      };
    }));

    res.json(result);
  } catch (err) {
    res.status(400).send({ error: "Error retrieving photos or comments" });
  }
});

module.exports = router;
