const { Schema, Types, model } = require("mongoose");

const bookmarkSchema = new Schema({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: [true, "please add user"],
  },
  postId: {
    type: Types.ObjectId,
    ref: "Post",
    required: [true, "please add post"],
  },
  createdBy: { type: Types.ObjectId, ref: "User" },
});

module.exports = model("Bookmark", bookmarkSchema);
