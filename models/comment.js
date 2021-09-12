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
    likeCount: { type: Number, default: 0 },
    likeIds: { type: Array },
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

commentSchema.methods.like = function (userId) {
  this.likeCount += 1;
  this.likeIds.push(userId);
};
commentSchema.methods.dislike = function (userId) {
  if (this.likeCount > 0) {
    this.likeCount -= 1;
    this.likeIds = this.likeIds.filter((match) => match !== userId);
  }
};

commentSchema.methods.removeReply = function () {
  if (this.repliesCount >= 0) {
    this.repliesCount -= 1;
  }
};

module.exports = model("Comment", commentSchema);
