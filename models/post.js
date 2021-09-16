const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please add a title"],
    },
    description: {
      type: String,
      minlenght: 10,
      maxlength: 2000,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      _id: false,
      ref: "User",
      required: [true, "please add creator"],
    },
    interestingVotes: { type: Array },
    votesCount: { type: Number, default: 0 },
    comments: [
      {
        comment: {
          type: mongoose.Types.ObjectId,
          ref: "Comment",
          _id: false,
        },
        _id: false,
      },
    ],
    category: {
      type: String,
      required: [true, "please add category"],
    },
    commentCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

postSchema.methods.upVote = function (userId) {
  this.votesCount += 1;
  this.interestingVotes.push({ userId });
};

postSchema.methods.removeVote = function (userId) {
  if (this.votesCount > 0) {
    this.votesCount -= 1;
    this.interestingVotes = this.interestingVotes.filter(
      (match) => match.userId !== userId
    );
  }
};

postSchema.methods.addComment = function (comment) {
  this.commentCount += 1;
  console.log(this.commentCount);
  this.comments.push({ comment });
};

postSchema.methods.handleCommentCount = function (n) {
  if (this.commentCount >= 0) {
    this.commentCount += n;
  }
};

module.exports = mongoose.model("Post", postSchema);
