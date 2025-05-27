const express = require("express");
const router = express.Router();

const commentController = require("../controllers/comment.controller");
const middlewareAuth = require("../../../middleware/auth.middleware");

router.post(
  "/:photoId",
  middlewareAuth.verifyToken,
  commentController.addCommentToPhoto
);

router.get(
  "/:photoId",
  middlewareAuth.verifyToken,
  commentController.getCommentsByPhoto
);

module.exports = router;
