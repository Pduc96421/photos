const User = require("../models/user.model");

// GET /api/v1/users/list
module.exports.listUser = async (req, res) => {
  try {
    const users = await User.find(
      {},
      "_id first_name last_name location description occupation"
    );
    res.json(users);
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
};

// GET /api/v1/users/:id
module.exports.detailUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId)

    if (!user) return res.status(400).send({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(400).send({ error: "Invalid user ID" });
  }
};
