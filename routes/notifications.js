const {
  newNotificaiton,
  getNotification,
} = require("../controllers/notificationsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = require("express").Router();

router.route("/:id").get(getNotification);
router.post("/").post(newNotificaiton);

module.exports = router;
