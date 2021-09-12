const express = require("express");
const {
  createComment,
  createReply,
  getComments,
  deleteReply,
  loadReplies,
  updateComment,
  deleteComment,
  likeComment,
  dislikeComment,
} = require("../controllers/commentController");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

router.route("/").post(authMiddleware, createComment);
router
  .route("/:id")
  .get(getComments)
  .patch(authMiddleware, updateComment)
  .delete(authMiddleware, deleteComment);
router.route("/replies/:id").get(loadReplies);
router.route("/?").delete(authMiddleware, deleteReply);
router.route("/reply").post(authMiddleware, createReply);
router
  .route("/like/:id")
  .post(authMiddleware, likeComment)
  .delete(authMiddleware, dislikeComment);

module.exports = router;
