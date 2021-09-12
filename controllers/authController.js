const CustomError = require("../errors/customError");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const Profile = require("../models/profile");

const register = async (req, res, next) => {
  const { email, username, name, bio, photourl, location, password } = req.body;
  try {
    let taken = await User.findOne({ $or: [{ email }, { username }] });

    if (taken) {
      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json({ taken: true });
    }

    const user = await User.create({ password, email, username });

    let profile = await Profile.create({
      name,
      bio,
      photourl,
      location,
      userId: user._id,
    });
    await user.hashPassword();
    user.profile = profile._id;
    user.photourl = photourl;
    await user.save();

    let token = user.generateToken();
    return res
      .status(200)
      .json({ user: { id: user._id, name: user.name, profile }, token });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

const login = async (req, res, next) => {
  const { password, username } = req.body;

  if (password === "" || username === "") {
    next(new CustomError("password or email cannot be blank", 400));
  }

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return next(new CustomError("user not found", 404));
    }

    let match = await user.verifyPassword(password);

    if (!match) {
      return next(new CustomError("invalid credentials", 401));
    }
    let token = user.generateToken();
    res.status(200).json({ user: { name: user.name, id: user._id }, token });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

module.exports = { login, register };
