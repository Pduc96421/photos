const express = require("express");
const router = express.Router();

const photoController = require("../controllers/photo.controller");

router.get('/user/:userId', photoController.getPhotosByUser);

router.get('/photo/:photoId', photoController.getPhotoById);

router.get('/allPhoto', photoController.getAllPhotos);

module.exports = router;
