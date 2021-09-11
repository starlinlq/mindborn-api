const express = require("express");
const router = express();
const {
  getProfile,
  updateProfile,
} = require("../controllers/profileController");

router.route("/:id").get(getProfile).patch(updateProfile);

module.exports = router;
