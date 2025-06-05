const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

// GET /api/v1/users/list
module.exports.listUser = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/v1/users/:id
module.exports.detailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");

    if (!user)
      return res.status(400).json({ message: "Không tìm thấy người dùng" });

    res.json(user);
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Post /api/v1/users/auth/login
module.exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        code: 400,
        message: "Người dùng không tồn tại",
      });
    }

    if (password !== user.password) {
      return res.status(400).json({
        code: 400,
        message: "Mật khẩu không đúng",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        first_name: user.first_name,
        last_name: user.last_name,
        description: user.description,
        occupation: user.occupation,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token);

    res.status(200).json({
      code: 200,
      message: "Đăng nhập thành công",
      result: token,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// Post /api/v1/users/auth/register
module.exports.registerUser = async (req, res) => {
  try {
    const { username } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        code: 400,
        message: "Người dùng đã tồn tại",
      });
    }

    const newUser = new User(req.body);

    await newUser.save();

    res.status(200).json({
      code: 200,
      message: "Đăng ký thành công",
      result: { id: newUser._id, username: newUser.username },
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};

// PATCH /api/v1/users/update
module.exports.updateUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const updateData = req.body;

    await User.updateOne({ _id: userId }, { $set: updateData });

    const updatedUser = await User.findById(userId).select("-password");

    res.status(200).json({
      code: 200,
      message: "Cập nhật thành công",
      result: updatedUser,
    });
  } catch (error) {
    res.status(500).send({ code: 500, error: error.message });
  }
};
