module.exports.addComment = async (req, res, next) => {
  const { comment } = req.body;
  if (!comment || comment.trim() === "") {
    return res.status(400).json({
      code: 400,
      message: "Bình luận không được để trống",
    });
  }

  next();
};
