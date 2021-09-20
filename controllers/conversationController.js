const CustomError = require("../errors/customError");
const Conversation = require("../models/conversation");
const newConversation = async (req, res, next) => {
  const { senderId, recieverId } = req.body;
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [senderId, recieverId] },
    });
    if (!conversation) {
      const newConversation = await Conversation.create({
        members: [senderId, recieverId],
      });
      return res.status(200).json(newConversation);
    }
    return res.status(200).json({ msg: "conversation already exists" });
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

const getConversationTwoUsers = async (req, res, next) => {
  const { firstuser, seconduser } = req.query;
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [firstuser, seconduser] },
    });
    res.status(200).json(conversation);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { newConversation, getConversation, getConversationTwoUsers };
