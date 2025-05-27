const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

// GET /api/v1/users/list
router.get("/list", controller.listUser);

// GET /api/v1/users/:id
router.get("/:id", controller.detailUser);

router.post("/auth/login", controller.loginUser);

module.exports = router;
