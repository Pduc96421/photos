const Comment = require("../models/comment.model");
const Photo = require("../models/photo.model");

// GET /api/v1/photos/user/:userId
module.exports.getPhotosByUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    const myUserId = req.user?.id;

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

    const newPhotos = photos.map((photo) => {
      const isLiked = photo.like.some(
        (like) => like.user_id.toString() === myUserId
      );
      return {
        _id: photo._id,
        title: photo.title,
        file_name: photo.file_name,
        user_id: photo.user_id,
        date_time: photo.date_time,
        commentLength: photo.comments.length,
        likeLength: photo.like.length,
        isLiked: isLiked,
      };
    });

    res.status(200).json({
      code: 200,
      message: "Hình ảnh trả về thành công",
      result: newPhotos,
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
module.exports.createPhoto = async (req, res) => {
  try {
    const user_id = req.user?.id;
    const { title } = req.body;
    const file = req.file;

    if (!file || !user_id) {
      return res.status(400).json({
        code: 400,
        message: "Thiếu ảnh hoặc thông tin người dùng",
      });
    }

    const newPhoto = new Photo({
      file_name: file.filename,
      title: title,
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

// DELETE /api/v1/photos/:photoId
module.exports.deletePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user?.id;

    const photo = await Photo.findOne({
      _id: photoId,
    });

    if (!photo) {
      return res.status(404).json({ message: "Không tìm thấy ảnh" });
    }

    if (photo.user_id.toString() !== userId) {
      return res.status(403).json({
        code: 403,
        message: "Bạn không có quyền xóa ảnh này",
      });
    }

    console.log(photo.comments);

    const comments = photo.comments || [];
    await Comment.deleteMany({ _id: { $in: comments } });

    await Photo.deleteOne({ _id: photoId });

    res.status(200).json({
      code: 200,
      message: "Xóa ảnh thành công",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/v1/photos/:photoId/like
module.exports.likePhoto = async (req, res) => {
  try {
    const { photoId } = req.params;
    const userId = req.user?.id;

    const photo = await Photo.findById(photoId);

    if (!photo) {
      return res.status(404).json({
        code: 404,
        message: "Không tìm thấy ảnh",
      });
    }

    // Kiểm tra nếu người dùng đã thích ảnh này
    const alreadyLiked = photo.like.some(
      (like) => like.user_id.toString() === userId
    );
    if (alreadyLiked) {
      return res.status(400).json({
        code: 400,
        message: "Bạn đã thích ảnh này rồi",
      });
    }

    // photo.like.push({ user_id: userId });
    await Photo.updateOne(
      { _id: photoId },
      { $push: { like: { user_id: userId } } }
    );

    const updatedPhoto = await Photo.findById(photoId).select("-__v");

    res.status(200).json({
      code: 200,
      message: "Thích ảnh thành công",
      result: updatedPhoto,
    });
  } catch (err) {
    console.error("Error liking photo:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET /api/v1/photos/search
module.exports.searchPhotos = async (req, res) => {
  try {
    const { keyword } = req.query;
    const myUserId = req.user?.id;

    if (!keyword) {
      return res.status(400).json({
        code: 400,
        message: "Vui lòng nhập từ khóa tìm kiếm",
      });
    }

    const searchRegex = new RegExp(keyword, "i");

    const photos = await Photo.find({
      title: { $regex: searchRegex },
    }).populate({
      path: "comments",
      select: "_id date_time",
    });

    const result = photos.map((photo) => {
      const isLiked = photo.like.some(
        (like) => like.user_id.toString() === myUserId
      );

      return {
        _id: photo._id,
        title: photo.title,
        file_name: photo.file_name,
        user_id: photo.user_id,
        date_time: photo.date_time,
        commentLength: photo.comments.length,
        likeLength: photo.like.length,
        isLiked: isLiked,
      };
    });

    res.status(200).json({
      code: 200,
      message: "Tìm kiếm thành công",
      result: result,
    });
  } catch (err) {
    res.status(500).json({
      code: 500,
      message: "Lỗi server",
      error: err.message,
    });
  }
};
