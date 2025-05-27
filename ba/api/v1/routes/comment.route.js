const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");
const verifyToken = require("../../../middleware/auth");

router.post("/:photoId", verifyToken, commentController.addCommentToPhoto);

router.get("/:photoId", verifyToken, commentController.getCommentsByPhoto);

module.exports = router;
