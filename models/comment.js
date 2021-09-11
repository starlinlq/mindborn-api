const { Schema, Types, model } = require("mongoose");

const commentSchema = new Schema(
  {
    username: { type: String, required: [true, "please add username"] },
    content: { type: String, required: [true, "please add comment text"] },
    postId: {
      type: Types.ObjectId,
      ref: "Post",
      _id: false,
    },
    isReply: { type: Boolean, default: false },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "please add user id"],
    },
    repliesIds: [
      {
        commentId: { type: Types.ObjectId, ref: "Comment", _id: false },
        _id: false,
      },
    ],
    repliesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

commentSchema.methods.reply = function (commentId) {
  this.repliesCount += 1;
  this.repliesIds.push({ commentId });
};

commentSchema.methods.removeReply = function () {
  if (this.repliesCount >= 0) {
    this.repliesCount -= 1;
  }
};

module.exports = model("Comment", commentSchema);
