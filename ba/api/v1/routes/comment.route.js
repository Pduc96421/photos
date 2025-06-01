const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");
const validate = require("../../../validates/comment.validate");

// /comments
router.post("/:photoId", validate.addComment ,commentController.addCommentToPhoto);

router.get("/:photoId", commentController.getCommentsByPhoto);

router.delete('/:commentId', commentController.deleteComment);

router.post('/:commentId/like', commentController.likeComment);

router.get('/:commentId/replies', commentController.getRepliesByComment);

module.exports = router;
