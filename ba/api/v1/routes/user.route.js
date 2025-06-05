const express = require("express");
const router = express.Router();

const controller = require("../controllers/user.controller");
const validateAccount = require("../../../validates/account.validate");
const middlewareAuth = require("../../../middleware/auth.middleware");

// /users
router.get("/list", controller.listUser);

router.get("/:id", controller.detailUser);

router.post("/auth/login", validateAccount.login, controller.loginUser);

router.post(
  "/auth/register",
  validateAccount.register,
  controller.registerUser
);

router.patch(
  "/update",
  middlewareAuth.verifyToken,
  validateAccount.update,
  controller.updateUser
);

module.exports = router;
