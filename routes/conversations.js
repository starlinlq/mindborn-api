const express = require("express");
const {
  newConversation,
  getConversation,
} = require("../controllers/conversationController");
const router = express.Router();

router.route("/").post(newConversation);
router.route("/:id").get(getConversation);
module.exports = router;
