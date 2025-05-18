const Photo = require("../models/photo.model");

// GET /api/v1/photos/user/:userId
module.exports.getPhotosByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const photos = await Photo.find({ user_id: userId });

    if (!photos.length) {
      return res
        .status(404)
        .json({ message: "No photos found for this user." });
    }

    res.status(200).json(photos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/v1/photos/photo/:photoId
module.exports.getPhotoById = async (req, res) => {
  try {
    const { photoId } = req.params;
    const photo = await Photo.findOne({ _id: photoId });

    if (!photo) {
      return res.status(404).json({ message: "Photo not found." });
    }

    // 3. Trả về object photo
    res.status(200).json(photo);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
