const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

// GET /api/v1/user/list
router.get("/list", async (req, res) => {
  try {
    const users = await User.find({}, "_id first_name last_name");
    res.json(users);
  } catch (err) {
    res.status(500).send({ error: "Server error" });
  }
});

// GET /api/v1/user/:id
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("_id first_name last_name location description occupation");
    if (!user) return res.status(400).send({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(400).send({ error: "Invalid user ID" });
  }
});

module.exports = router;
