const express = require("express");
const {
  newConversation,
  getConversation,
  getConversationTwoUsers,
} = require("../controllers/conversationController");
const router = express.Router();

router.route("/").get(getConversationTwoUsers).post(newConversation);
router.route("/:id").get(getConversation);

module.exports = router;
