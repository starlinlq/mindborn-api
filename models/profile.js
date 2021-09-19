const { Schema, model, Types } = require("mongoose");

const profileSchema = new Schema({
  name: {
    type: String,
    minLength: 2,
    maxlength: 15,
    required: [true, "name is required"],
  },
  bio: {
    type: String,
    minLength: 10,
    maxlength: 150,
    required: [true, "please add bio"],
  },
  photourl: { type: String, required: [true, "photo is required"] },
  location: {
    type: String,
    minlength: 2,
    maxlength: 15,
    required: [true, "locaiton is required"],
  },
  userId: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Profile", profileSchema);
