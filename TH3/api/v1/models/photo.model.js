const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const photoSchema = new Schema({
  _id: {
    type: String,
    require: true,
  },
  file_name: {
    type: String,
    required: true,
  },
  date_time: {
    type: Date,
    default: Date.now,
  },
  user_id: {
    type: String,
    required: true,
  },
  comments: [
    {
      user_id: String,
      photo_id: String,
      comment: String,
    },
  ],
});

const Photo = mongoose.model("Photo", photoSchema, "photos");

module.exports = Photo;
