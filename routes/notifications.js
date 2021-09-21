const {
  newNotificaiton,
  getNotification,
} = require("../controllers/notificationsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = require("express").Router();

router.route("/").get(authMiddleware, getNotification).post(newNotificaiton);

module.exports = router;
