const CustomError = require("../errors/customError");
const Conversation = require("../models/conversation");
const Message = require("../models/message");
const addMessages = async (req, res, next) => {
  try {
    const newMessage = await Message.create(req.body);
    res.status(200).json(newMessage);
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};
const getMessages = async (req, res, next) => {
  try {
    let conversation = await Message.find({
      conversationid: req.params.id,
    });
    res.status(200).json(conversation);
  } catch (error) {}
};

module.exports = { addMessages, getMessages };
