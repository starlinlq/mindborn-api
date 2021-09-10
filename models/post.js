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
    interestingVotes: { type: Object, default: { up: 0, down: 0 } },
    category: {
      type: String,
      required: [true, "please add category"],
    },
  },
  { timestamps: true }
);

postSchema.methods.upVote = function () {
  this.interestingVotes.up = +1;
};

postSchema.methods.downVote = function () {
  if (this.interestingVotes.down !== 0) {
    this.interestingVotes.down -= 1;
  }
};

module.exports = mongoose.model("Post", postSchema);
