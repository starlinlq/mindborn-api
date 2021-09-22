const {
  newNotificaiton,
  getNotification,
} = require("../controllers/notificationsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = require("express").Router();

router.route("/").post(newNotificaiton);
router.route("/:id").get(getNotification);

module.exports = router;
