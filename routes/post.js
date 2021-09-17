const express = require("express");
const router = express.Router();
const {
  getAllPost,
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
  getUserPost,
  upVotePost,
  deleteVote,
} = require("../controllers/postController");
const authMiddleware = require("../middleware/authMiddleware");

router.route("/user/").get(authMiddleware, getUserPost);
router
  .route("/upvote/:id")
  .post(authMiddleware, upVotePost)
  .delete(authMiddleware, deleteVote);
router.route("/").get(getAllPost).post(authMiddleware, createPost);
router
  .route("/:id")
  .get(getSinglePost)
  .patch(authMiddleware, updatePost)
  .delete(authMiddleware, deletePost);

module.exports = router;
