const express = require("express");
const router = express.Router();
const {
  login,
  register,
  validateToken,
  updateUserPassword,
  updateUserId,
  searchUser,
  getUser,
} = require("../controllers/authController");

const AuthMiddleware = require("../middleware/authMiddleware");

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/validate").get(AuthMiddleware, validateToken);
router.route("/update/password").post(AuthMiddleware, updateUserPassword);
router.route("/update/:id").post(AuthMiddleware, updateUserId);
router.route("/").get(searchUser);
router.route("/:id").get(getUser);

module.exports = router;
