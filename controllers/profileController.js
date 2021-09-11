const Profile = require("../models/profile");

const getProfile = async (req, res, next) => {
  res.send("profile");
};
const updateProfile = async (req, res, next) => {
  res.send("profile update");
};
module.exports = { getProfile, updateProfile };
