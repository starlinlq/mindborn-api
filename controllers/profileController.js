const Profile = require("../models/profile");
const { StatusCodes } = require("http-status-codes");
const CustomError = require("../errors/customError");
const Post = require("../models/post");
const User = require("../models/user");
const getProfile = async (req, res, next) => {
  let userId = req.params.id;
  try {
    let profile = await Profile.findOne({ userId });
    let posts = await Post.find({ createdBy: userId });
    if (!profile) {
      return next(new CustomError("profile not found", StatusCodes.NOT_FOUND));
    }
    return res.status(StatusCodes.OK).json({ profile, posts });
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};
const updateProfile = async (req, res, next) => {
  const { name, bio, photourl, location } = req.body;

  try {
    let user = await User.findOne({ _id: req.user.id });
    let profile = await Profile.findOne({ userId: req.user.id });
    if (profile) {
      profile.name = name;
      profile.bio = bio;
      profile.photurl = photourl;
      profile.locaiton = location;
      user.photourl = photourl;
      await user.save();
      await profile.save();
      return res.status(StatusCodes.OK);
    }
    return res.status(StatusCodes.BAD_REQUEST);
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};
module.exports = { getProfile, updateProfile };
