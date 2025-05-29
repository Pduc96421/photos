const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
const validateAccount = require("../../../validates/account.validate");

// /users
router.get("/list", controller.listUser);

router.get("/:id", controller.detailUser);

router.post("/auth/login", validateAccount.login, controller.loginUser);

router.post(
  "/auth/register",
  validateAccount.register,
  controller.registerUser
);

module.exports = router;
