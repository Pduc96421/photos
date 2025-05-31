const express = require("express");
const router = express.Router();

const photoController = require("../controllers/photo.controller");
const upload = require("../../../middleware/upload.middleware");

// /photos
router.get("/:userId/user", photoController.getPhotosByUser);

router.get("/:photoId/photo", photoController.getPhotoById);

router.get("/allPhoto", photoController.getAllPhotos);

router.post("/create", upload.single("file_name"), photoController.createPhoto);

router.delete("/:photoId", photoController.deletePhoto);

module.exports = router;
