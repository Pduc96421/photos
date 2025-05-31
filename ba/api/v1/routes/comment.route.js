const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");

// /comments
router.post("/:photoId", commentController.addCommentToPhoto);

router.get("/:photoId", commentController.getCommentsByPhoto);

router.delete('/:commentId', commentController.deleteComment);

module.exports = router;
