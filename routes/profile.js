const express = require("express");
const router = express();
const {
  getProfile,
  updateProfile,
  follow,
  unFollow,
  getFollowing,
  getFollowers,
  searchProfile,
} = require("../controllers/profileController");
const authMiddleware = require("../middleware/authMiddleware");

router.route("/:id").get(getProfile);
router
  .route("/follow/:id")
  .post(authMiddleware, follow)
  .delete(authMiddleware, unFollow);
router.route("/following/:id").get(getFollowing);
router.route("/followers/:id").get(getFollowers);
router.route("/").patch(authMiddleware, updateProfile);

module.exports = router;
