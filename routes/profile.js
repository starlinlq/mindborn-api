const express = require("express");
const router = express();
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");
const Profile = require("../models/profile");

router.route("/:id").get(getProfile);
router.route("/").patch(authMiddleware, updateProfile);

module.exports = router;
