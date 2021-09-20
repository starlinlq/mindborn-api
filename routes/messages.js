const express = require("express");
const router = express.Router();

const {
  addMessages,
  getMessages,
} = require("../controllers/messageController");

router.route("/").post(addMessages);
router.route("/:id").get(getMessages);

module.exports = router;
