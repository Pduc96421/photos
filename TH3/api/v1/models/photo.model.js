const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Schema cho một comment
const commentSchema = new Schema({
  comment: { type: String, required: true },
  date_time: { type: Date, required: true },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

// Schema cho một bức ảnh
const photoSchema = new Schema({
  file_name: { type: String, required: true },
  date_time: { type: Date, required: true },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  comments: [commentSchema],
});

const Photo = mongoose.model("Photo", photoSchema, "photos");

module.exports = Photo;
