const express = require("express");
const router = express.Router();

const photoController = require("../controllers/photo.controller");
const verifyToken = require("../../../middleware/auth");

router.get('/user/:userId', photoController.getPhotosByUser);

router.get('/photo/:photoId', photoController.getPhotoById);

router.get('/allPhoto', verifyToken, photoController.getAllPhotos);

module.exports = router;
