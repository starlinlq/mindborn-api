const CustomError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");

const Post = require("../models/post");

const getAllPost = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    return res.status(StatusCodes.OK).json({ posts });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const getUserPost = async (req, res) => {
  let userId = req.user.id;
  try {
    let post = await Post.find({ createdBy: userId });
    return res.status(StatusCodes.OK).json({ post });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};
const createPost = async (req, res, next) => {
  try {
    let post = await Post.create({ ...req.body, createdBy: req.user.id });
    return res.status(StatusCodes.CREATED).json({ post });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const getSinglePost = async (req, res, next) => {
  let postId = req.params.id;
  try {
    let post = await Post.findOne({ _id: postId });
    if (!post) {
      return next(new CustomError("post not found", StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({ post });
  } catch (error) {
    return next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const updatePost = async (req, res, next) => {
  let postId = req.params.id;
  let userId = req.user.id;
  try {
    let post = await Post.findOneAndUpdate(
      { _id: postId, createdBy: userId },
      req.body,
      {
        new: true,
      }
    );
    return res.status(StatusCodes.OK).json({ post });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const deletePost = async (req, res, next) => {
  let postId = req.params.id;
  let userId = req.user.id;
  try {
    await Post.deleteOne({ createdBy: userId, _id: postId });
    return res.status(StatusCodes.OK);
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

module.exports = {
  getAllPost,
  createPost,
  getSinglePost,
  updatePost,
  deletePost,
  getUserPost,
};
