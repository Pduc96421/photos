const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  file_name: { type: String },
  date_time: { type: Date, default: Date.now },
  user_id: { type: Schema.Types.ObjectId, ref: "User" },
  comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  like: [
    {
      user_id: { type: Schema.Types.ObjectId, ref: "User" },
      date_time: { type: Date, default: Date.now },
    },
  ],
});

const Photo = mongoose.model("Photo", photoSchema, "photos");

module.exports = Photo;
