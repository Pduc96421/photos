const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  comment: { type: String, required: true },
  date_time: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  photo_id: { type: Schema.Types.ObjectId, ref: "Photo", required: true },
});

const Comment = mongoose.model("Comment", commentSchema, "comments");

module.exports = Comment;
