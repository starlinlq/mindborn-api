const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      match: [/^[a-zA-Z0-9]+$/, "name is invalid, make sure is lowercase"],
      required: [true, "name is required"],
      lowercase: true,
      unique: true,
      maxlength: 15,
      minlength: 3,
    },
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
      minlength: 6,
    },
    profile: { type: mongoose.Types.ObjectId, ref: "Profile" },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  let salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id, name: this.name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};

userSchema.methods.verifyPassword = async function (inputPassword) {
  let match = await bcrypt.compare(inputPassword, this.password);

  return match;
};

module.exports = mongoose.model("User", userSchema);
