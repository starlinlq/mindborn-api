const CustomError = require("../errors/customError");
const Notification = require("../models/notifications");

const newNotificaiton = async (req, res, next) => {
  const { notification, sender, reciever, belongsTo, type } = req.body;

  try {
    const noti = await Notification.create({
      notification,
      sender,
      reciever,
      belongsTo,
      type,
    });
    return res.status(200).json(noti);
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};
const getNotification = async (req, res, next) => {
  const id = req.params.id;
  try {
    let notifications = await Notification.find({
      reciever: id,
    })
      .populate("sender", (select = ["username", "photourl", "_id"]))
      .sort("-createdAt")
      .limit(20);
    res.status(200).json(notifications);
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

module.exports = { newNotificaiton, getNotification };
