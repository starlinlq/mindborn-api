const CustomError = require("../errors/customError");
const { StatusCodes } = require("http-status-codes");
const Comment = require("../models/comment");
const Post = require("../models/post");

const getComments = async (req, res, next) => {
  let postId = req.params.id;
  try {
    let comments = await Comment.find({ postId, isReply: false })
      .populate(
        "repliesIds.commentId",
        (select = [
          "username",
          "content",
          "userId",
          "repliesIds",
          "repliesCount",
          "likeCount",
        ])
      )
      .select([
        "username",
        "content",
        "userId",
        "repliesIds",
        "repliesCount",
        "likeCount",
      ])
      .sort({ likeCount: -1 });

    if (!comments) {
      return next(new CustomError("comments not found", StatusCodes.NOT_FOUND));
    }

    res.status(200).send({ comments });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const loadReplies = async (req, res, next) => {
  try {
    let comment = await Comment.findOne({ _id: req.params.id }).populate({
      path: "repliesIds.commentId",
      select: ["username", "content", "userId", "repliesIds", "repliesCount"],
    });
    if (!comment) {
      return next(new CustomError("replies not found", StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).send({ comment });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const createComment = async (req, res, next) => {
  const { postId } = req.body;
  try {
    const post = await Post.findOne({ _id: postId });
    if (!post) {
      return next(new CustomError("post not found", StatusCodes.NOT_FOUND));
    }

    const comment = await Comment.create(req.body);
    post.addComment(comment._id);
    await post.save();

    return res.status(StatusCodes.CREATED).json({ comment });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const createReply = async (req, res, next) => {
  const { commentId, userId, content, username, postId } = req.body;

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
      userId,
      content,
      username,
      isReply: true,
    });
    comment.reply(newComment._id);
    await comment.save();
    res.status(StatusCodes.CREATED).json({ comment: newComment });
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
    if (!comment) {
      return next(new CustomError("comment not found", StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).send("");
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const deleteReply = async (req, res, next) => {
  const { main, reply, userId } = req.query;
  try {
    let mainComment = await Comment.findOne({ _id: main });
    let deleted = await Comment.findOneAndDelete({ _id: reply, userId });
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
