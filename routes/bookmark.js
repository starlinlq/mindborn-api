const express = require("express");
const {
  bookmark,
  unBookmark,
  getBookmarks,
} = require("../controllers/bookmarrk");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router
  .route("/")
  .get(authMiddleware, getBookmarks)
  .post(authMiddleware, bookmark);
router.route("/:id").delete(authMiddleware, unBookmark);
module.exports = router;
