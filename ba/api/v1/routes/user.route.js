const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");

router.get("/list", controller.listUser);

router.get("/:id", controller.detailUser);

router.post("/auth/login", controller.loginUser);

router.post("/auth/register", controller.registerUser);

module.exports = router;
