const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      match: [/^[a-zA-Z0-9]+$/, "username is invalid, make sure is lowercase"],
      required: [true, "username is required"],
      lowercase: true,
      unique: true,
      maxlength: 20,
      minlength: 3,
    },
    photourl: { type: String },
    email: {
      type: String,
      required: [true, "email is required"],
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide valid email",
      ],
      unique: true,
    },
    password: {
      type: String,
    },
    profile: { type: mongoose.Types.ObjectId, ref: "Profile" },
  },
  { timestamps: true }
);

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, username: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );
};

userSchema.methods.hashPassword = async function () {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
};

userSchema.methods.verifyPassword = async function (inputPassword) {
  let match = await bcrypt.compare("password", this.password);

  return match;
};

module.exports = mongoose.model("User", userSchema);
