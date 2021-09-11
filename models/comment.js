const { Schema, Types, model } = require("mongoose");

const commentSchema = new Schema(
  {
    username: { type: String, required: [true, "please add username"] },
    content: { type: Text, required: [true, "please add comment text"] },
    postId: {
      type: Types.ObjectId,
      ref: "Post",
      required: [true, "please add post id"],
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "please add user id"],
    },
    repliesIds: [{ replyId: { type: Types.ObjectId, ref: "Reply" } }],
  },
  { timestamps: true }
);

module.exports = model("Comment", commentSchema);
