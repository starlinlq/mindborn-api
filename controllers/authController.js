const CustomError = require("../errors/customError");
const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const Profile = require("../models/profile");

const register = async (req, res, next) => {
  const { email, username, name, password } = req.body;
  let photourl =
    "https://t3.ftcdn.net/jpg/03/91/19/22/360_F_391192211_2w5pQpFV1aozYQhcIw3FqA35vuTxJKrB.jpg";
  try {
    let taken = await User.findOne({ $or: [{ email }, { username }] });

    if (taken) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ msg: "ID or EMAIL is already taken, please try another one" });
    }

    const user = await User.create({ password, email, username });

    let profile = await Profile.create({
      name,
      photourl,
      bio: "Living my best",
      location: "Going places",
      userId: user._id,
    });
    await user.hashPassword();
    user.profile = profile._id;
    user.photourl = photourl;
    await user.save();

    let token = user.generateToken();
    return res
      .status(200)
      .json({ id: user._id, username, token, photourl: user.photourl });
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

    res.status(200).json({
      user: {
        username: user.username,
        id: user._id,
        photourl: user.photourl,
      },
      token,
    });
  } catch (error) {
    next(new CustomError(error.message, 400));
  }
};

const updateUserId = async (req, res, next) => {
  const userId = req.user.id;
  const newId = req.body.newId;
  console.log(newId);

  const currentPassword = req.body.currentPassword;
  try {
    let found = await User.findOne({ username: newId });
    if (!found) {
      let currentUser = await User.findOne({ _id: userId });
      if (currentUser) {
        let match = await currentUser.verifyPassword(currentPassword);
        if (match) {
          currentUser.username = newId;
          await currentUser.save();
          return res.status(StatusCodes.OK).json({ msg: "ID updated" });
        }
      }
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ msg: "incorrect password" });
    }
    res.status(StatusCodes.BAD_REQUEST).json({ msg: "ID is already taken" });
  } catch (error) {
    next(new CustomError(StatusCodes.BAD_REQUEST, error.message));
  }
};

const updateUserPassword = async (req, res, next) => {
  const userId = req.user.id;
  const currentPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;
  try {
    let currentUser = await User.findOne({ _id: userId });
    if (currentUser) {
      let match = await currentUser.verifyPassword(currentPassword);
      if (match) {
        currentUser.password = newPassword;
        await currentUser.hashPassword();
        await currentUser.save();
        return res.status(StatusCodes.OK).json({ msg: "password updated" });
      } else {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ msg: "password do not match" });
      }
    }
    return res.status(StatusCodes.NOT_FOUND).json({ msg: "user not found" });
  } catch (error) {
    next(new CustomError(StatusCodes.BAD_REQUEST), error.message);
  }
};

const searchUser = async (req, res, next) => {
  const { q } = req.query;
  console.log(q);
  try {
    let users = await User.find({
      username: { $regex: q, $options: "i" },
    }).select(["username", "_id", "photourl"]);
    res.status(200).json(users);
  } catch (error) {}
};

const getUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    let user = await User.findOne({ _id: id }).select([
      "photourl",
      "username",
      "_id",
    ]);
    if (user) {
      res.status(StatusCodes.OK).json(user);
    }
  } catch (error) {
    next(new CustomError(error.message, StatusCodes.BAD_REQUEST));
  }
};

const validateToken = async (req, res, next) => {
  res.status(StatusCodes.OK).json(req.user);
};

module.exports = {
  login,
  register,
  validateToken,
  updateUserId,
  updateUserPassword,
  searchUser,
  getUser,
};
