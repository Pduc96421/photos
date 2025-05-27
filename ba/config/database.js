const mongoose = require("mongoose");

module.exports.connect = async () => {
  try {
    mongoose.connect(process.env.MONGO_URL);
    console.log("Connect DataBase MongoDB Success!");
  } catch (error) {
    console.log("Connect DataBase MongoDB Error!");
  }
}