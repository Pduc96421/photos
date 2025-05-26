const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true,
  },
  date_time: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  photo_id: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema, "comments");

module.exports = Comment;
