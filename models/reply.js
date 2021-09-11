const { model, Schema, Types } = require("mongoose");

const replySchema = new Schema(
  {
    username: { type: String, required: [true, "please add username"] },
    content: { type: Text, required: [true, "please add comment text"] },
    commentId: {
      type: Types.ObjectId,
      ref: "Comment",
      required: [true, "please add comment id"],
    },
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: [true, "please add user id"],
    },
  },
  { timestamps: true }
);

module.exports = model("Reply", replySchema);
