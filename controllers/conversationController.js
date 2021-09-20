const CustomError = require("../errors/customError");
const Conversation = require("../models/conversation");
const newConversation = async (req, res, next) => {
  const { senderId, recieverId } = req.body;
  try {
    const newConversation = await Conversation.create({
      members: [senderId, recieverId],
    });
    res.status(200).json(newConversation);
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

const getConversation = async (req, res, next) => {
  try {
    let conversation = await Conversation.find({
      members: { $in: [req.params.id] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

module.exports = { newConversation, getConversation };
