const CustomError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/comment");
const Post = require("../models/post");

const getComments = async (req, res, next) => {
  let { postid, query, limit } = req.query;
  try {
    let comments = await Comment.find({ postId: postid, isReply: false })
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
      .populate("userId", (select = ["_id", "username", "photourl"]))
      .sort(`${query}`)
      .limit(limit);

    if (!comments) {
      return next(new CustomError("comments not found", StatusCodes.NOT_FOUND));
    }

    return res.status(200).send({ comments });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const loadReplies = async (req, res, next) => {
  console.log(req.params.id);
  try {
    let comment = await Comment.find({
      commentId: req.params.id,
    })
      .select(["content", "likeCount", "userId", "_id", "createdAt", "likeIds"])
      .populate("userId", (select = ["username", "_id", "photourl"]));
    if (!comment) {
      return next(new CustomError("replies not found", StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).send({ comment });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const createComment = async (req, res, next) => {
  const { postId, content } = req.body;
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return next(new CustomError("post not found", StatusCodes.NOT_FOUND));
    }

    const comment = await Comment.create({
      content,
      postId,
      username: req.user.username,
      userId: req.user.id,
    });
    post.addComment(comment._id);
    await post.save();

    return res.status(StatusCodes.CREATED).json({
      comment,
      user: {
        _id: req.user.id,
        username: req.user.username,
        photourl: req.user.photourl,
      },
    });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const createReply = async (req, res, next) => {
  const { commentId, content, postId } = req.body;

  try {
    let comment = await Comment.findOne({ _id: commentId });
    let post = await Post.findOne({ _id: postId });
    if (!post || !comment) {
      return next(
        new CustomError(
          "either the post or the comment you are trying to reply was not found",
          400
        )
      );
    }
    post.handleCommentCount(1);
    await post.save();
    let newComment = await Comment.create({
      userId: req.user.id,
      content,
      username: req.user.username,
      isReply: true,
      commentId,
    });
    comment.reply(newComment._id);
    await comment.save();
    res.status(StatusCodes.CREATED).json({
      content: newComment.content,
      likeIds: newComment.likeIds,
      isReply: newComment.isReply,
      _id: newComment._id,
      likeCount: newComment.likeCount,
      userId: {
        username: req.user.username,
        _id: req.user.id,
        photourl: req.user.photourl,
      },
      createdAt: newComment.createdAt,
    });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};
const updateComment = async (req, res, next) => {
  let commentId = req.params.id;
  try {
    let comment = await Comment.findOneAndUpdate(
      { _id: commentId, userId: req.user.id },
      req.body,
      {
        new: true,
      }
    );
    if (!comment) {
      return next(new CustomError("not found", StatusCodes.NOT_FOUND));
    }

    res.status(StatusCodes.OK).json({ comment });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const deleteComment = async (req, res, next) => {
  let commentId = req.params.id;
  let userId = req.user.id;
  try {
    let comment = await Comment.findOneAndDelete({ _id: commentId, userId });

    let post = await Post.findOne({ _id: comment.postId });
    post.handleCommentCount(-1);
    await post.save();

    if (!comment) {
      return next(new CustomError("comment not found", StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).send("");
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const deleteReply = async (req, res, next) => {
  const { main, reply } = req.query;
  let userId = req.user.id;
  try {
    let mainComment = await Comment.findOne({ _id: main });
    let deleted = await Comment.findOneAndDelete({ _id: reply, userId });
    let post = await Post.findOne({ _id: mainComment.postId });
    post.handleCommentCount(-1);
    await post.save();
    if (!deleted || !mainComment) {
      return next(
        new CustomError(
          "something went wrong deleting your document",
          StatusCodes.BAD_REQUEST
        )
      );
    }
    mainComment.removeReply();
    await mainComment.save();
    return res.status(StatusCodes.OK).send("");
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const likeComment = async (req, res, next) => {
  let commentId = req.params.id;
  let userId = req.user.id;
  try {
    let comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return next(new CustomError("comment not found", StatusCodes.NOT_FOUND));
    }
    comment.like(userId);
    await comment.save();
    res.status(StatusCodes.OK).send("");
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};
const dislikeComment = async (req, res, next) => {
  let commentId = req.params.id;
  let userId = req.user.id;
  try {
    let comment = await Comment.findOne({ _id: commentId });
    if (!comment) {
      return next(new CustomError("comment not found", StatusCodes.NOT_FOUND));
    }
    comment.dislike(userId);
    await comment.save();
    res.status(StatusCodes.OK).send("");
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

module.exports = {
  getComments,
  loadReplies,
  createComment,
  updateComment,
  deleteReply,
  createReply,
  deleteComment,
  likeComment,
  dislikeComment,
};
