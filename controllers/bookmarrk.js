const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/customError");
const Bookmark = require("../models/bookmark");
const Post = require("../models/post");

const bookmark = async (req, res, next) => {
  let postId = req.body.postId;
  let userId = req.user.id;
  let createdBy = req.body.createdBy;

  try {
    let post = await Post.findOne({ _id: postId });
    if (post) {
      let data = await Bookmark.create({ postId, userId, createdBy });
      post.addBookmark(userId);
      await post.save();
      return res.status(StatusCodes.OK).json({ data });
    }
    next(new CustomError("post was not found", StatusCodes.NOT_FOUND));
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const getBookmarks = async (req, res, next) => {
  try {
    let data = await Bookmark.find({ userId: req.user.id })
      .select(["createdBy", "postId", "-_id"])
      .populate("createdBy", (select = ["_id", "username", "photourl"]))
      .populate(
        "postId",
        (select = [
          "_id",
          "category",
          "createdAt",
          "title",
          "description",
          "votesCount",
          "commentCount",
          "bookmarkIds",
        ])
      );

    res.status(StatusCodes.OK).json({ data });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};
const unBookmark = async (req, res, next) => {
  let postId = req.params.id;
  try {
    let post = await Post.findOne({ _id: postId });
    await Bookmark.findOneAndDelete({
      postId,
      userId: req.user.id,
    });
    post.unBookmark(req.user.id);
    await post.save();
    res.status(StatusCodes.OK).send("deleted");
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

module.exports = {
  bookmark,
  unBookmark,
  getBookmarks,
};
