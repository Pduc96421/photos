const express = require("express");
const router = express.Router();

const photoController = require("../controllers/photo.controller");
const middlewareAuth = require("../../../middleware/auth.middleware");
const upload = require("../../../middleware/upload.middleware");

router.get("/:userId/user", middlewareAuth.verifyToken, photoController.getPhotosByUser);

router.get("/:photoId/photo", photoController.getPhotoById);

router.get(
  "/allPhoto",
  middlewareAuth.verifyToken,
  photoController.getAllPhotos
);

router.post(
  "/create",
  middlewareAuth.verifyToken,
  upload.single("file_name"),
  photoController.createPhoto
);

module.exports = router;
