const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please add a title"],
    },
    description: {
      type: String,
      required: [true, "please add a description"],
      minlenght: 10,
      maxlength: 2000,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "please add creator"],
    },
    interestingVotes: { type: Array },
    comments: [
      { commentId: { type: mongoose.Types.ObjectId, ref: "Comment" } },
    ],
    category: {
      type: String,
      required: [true, "please add category"],
    },
  },
  { timestamps: true }
);

postSchema.methods.upVote = function (userId) {
  this.interestingVotes.push({ userId });
};

postSchema.methods.removeVote = function (userId) {
  this.interestingVotes = this.interestingVotes.filter(
    (match) => match.userId !== userId
  );
};

postSchema.methods.addComment = function (commentId) {};

module.exports = mongoose.model("Post", postSchema);
