const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  file_name: { type: String, required: true },
  date_time: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
});

const Photo = mongoose.model("Photo", photoSchema, "photos");

module.exports = Photo;
