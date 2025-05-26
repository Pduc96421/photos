const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");

// POST /api/v1/comments/:photoId
router.post("/:photoId", commentController.addCommentToPhoto);

router.get('/:photoId', commentController.getCommentsByPhoto);

module.exports = router;
