const express = require("express");
const router = express.Router();
const {
  login,
  register,
  validateToken,
} = require("../controllers/authController");

const AuthMiddleware = require("../middleware/authMiddleware");

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/validate").get(AuthMiddleware, validateToken);

module.exports = router;
