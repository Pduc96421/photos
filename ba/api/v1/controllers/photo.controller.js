const Photo = require("../models/photo.model");

// GET /api/v1/photos/user/:userId
module.exports.getPhotosByUser = async (req, res) => {
  try {
    const userId = req.params.userId;

    const photos = await Photo.find({ user_id: userId }).populate({
      path: "comments",
      select: "_id date_time",
    });

    if (!photos.length) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy ảnh cho người dùng này.",
      });
    }

    res.status(200).json({
      code: 200,
      message: "Hình ảnh trả về thành công",
      result: photos,
    });
  } catch (err) {
    console.error("Lỗi khi lấy ảnh theo user:", err);
    res.status(500).json({ code: 500, error: err.message });
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

// GET /api/v1//photos/allPhoto
module.exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find();

    if (!photos.length) {
      return res.status(404).json({ message: "Không tìm thấy ảnh nào" });
    }

    res.status(200).json({
      code: 200,
      message: "Lấy ảnh thành công",
      result: photos,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/v1/photos/create
exports.createPhoto = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const file = req.file;

    if (!file || !user_id) {
      return res.status(400).json({
        code: 400,
        message: "Thiếu ảnh hoặc thông tin người dùng",
      });
    }

    const newPhoto = new Photo({
      file_name: file.filename,
      user_id,
    });

    const savedPhoto = await newPhoto.save();

    res.status(200).json({
      code: 200,
      message: "Tạo ảnh thành công",
      result: savedPhoto,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: err.message,
    });
  }
};
