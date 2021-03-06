const CustomError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/comment");

const Post = require("../models/post");

const getAllPost = async (req, res, next) => {
  const { filterBy, category, limit, q } = req.query;

  try {
    if (category === "all") {
      const posts = await Post.find(
        q ? { title: { $regex: q, $options: "i" } } : {}
      )
        .populate("createdBy", (select = ["username", "_id", "photourl"]))
        .select(["-__v", "-updatedAt"])
        .sort(`${filterBy}`)
        .limit(Number(limit));
      //get length
      const count = await Post.find(
        q ? { title: { $regex: q, $options: "i" } } : {}
      )
        .populate("createdBy", (select = ["username", "_id", "photourl"]))
        .select(["-__v", "-updatedAt"])
        .sort(`${filterBy}`)
        .countDocuments();
      return res.status(StatusCodes.OK).json({ posts, length: count });
    }

    const posts = await Post.find(
      q ? { title: { $regex: q, $options: "i" }, category } : { category }
    )
      .populate("createdBy", (select = ["username", "_id", "photourl"]))
      .select(["-__v", "-updatedAt"])
      .sort(`${filterBy}`)
      .limit(limit);
    //get length
    const count = await Post.find(
      q ? { title: { $regex: q, $options: "i" }, category } : { category }
    )
      .populate("createdBy", (select = ["username", "_id", "photourl"]))
      .select(["-__v", "-updatedAt"])
      .sort(`${filterBy}`)
      .countDocuments();
    return res.status(StatusCodes.OK).json({ posts, length: count });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

const getUserPost = async (req, res, next) => {
  const { filterBy, category, userId } = req.query;

  try {
    let posts = await Post.find(
      category === "all"
        ? { createdBy: userId }
        : { createdBy: userId, category }
    )
      .sort(`${filterBy}`)
      .populate("createdBy", (select = ["username", "_id", "photourl"]));
    //get length
    let length = await Post.find(
      category === "all"
        ? { createdBy: userId }
        : { createdBy: userId, category }
    )
      .sort(`${filterBy}`)
      .populate("createdBy", (select = ["username", "_id", "photourl"]))
      .countDocuments();
    return res.status(StatusCodes.OK).json({ posts, length });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};
const createPost = async (req, res, next) => {
  try {
    let post = await Post.create({ ...req.body, createdBy: req.user.id });
    return res.status(StatusCodes.CREATED).json({ id: post._id });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const getSinglePost = async (req, res, next) => {
  let postId = req.params.id;

  try {
    let post = await Post.findOne({ _id: postId })
      .select(["-updatedAt", "-__v", "-comments"])
      .populate("createdBy", (select = ["username", "_id", "photourl"]));

    let comments = await Comment.find({ postId: post._id })
      .populate("userId", (select = ["username", "photourl", "id"]))
      .select([
        "_id",
        "content",
        "createdAt",
        "likeCount",
        "postId",
        "repliesCount",
        "userId",
        "likeIds",
      ])

      .sort({ likeCount: -1 })
      .limit(10);

    let commentsCount = await Comment.find({
      postId: post._id,
    }).countDocuments();

    if (!post) {
      return next(new CustomError("post not found", StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({ post, comments, commentsCount });
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
    return res.status(StatusCodes.OK).send("post deleted");
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const upVotePost = async (req, res, next) => {
  let postId = req.params.id;
  let userId = req.user.id;
  try {
    let post = await Post.findOne({ _id: postId });
    post.upVote(userId);
    await post.save();
    return res.status(200).json({ post });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const deleteVote = async (req, res, next) => {
  let postId = req.params.id;
  let userId = req.user.id;

  try {
    let post = await Post.findOne({ _id: postId });
    post.removeVote(userId);
    await post.save();
    res.status(StatusCodes.OK).json({ post });
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
  upVotePost,
  deleteVote,
};
