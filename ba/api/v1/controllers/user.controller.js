const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// GET /api/v1/users/list
module.exports.listUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password -token");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/v1/users/:id
module.exports.detailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password -token");

    if (!user)
      return res.status(400).json({ message: "Không tìm thấy người dùng" });

    res.json(user);
  } catch (err) {
    res.status(400).send({ error: "Invalid user ID" });
  }
};

// Post /api/v1/users/auth/login
module.exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: "username và password là bắt buộc",
      });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: "Người dùng không tồn tại",
      });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      code: 200,
      message: "Đăng nhập thành công",
      result: token,
    });
  } catch (err) {
    res.status(500).send({ error: "Server bị lỗi" });
  }
};
