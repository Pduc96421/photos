const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String },
  last_name: { type: String },
  location: { type: String },
  description: { type: String },
  occupation: { type: String },
  username: { type: String },
  password: { type: String },
});

const User = mongoose.model("User", userSchema, "users");

module.exports = User;
