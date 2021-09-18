const mongoose = require("mongoose");

const followerSchema = mongoose.Schema({
  userId: { type: mongoose.Types.ObjectId, ref: "User" },
  follower_id: { type: mongoose.Types.ObjectId, ref: "User" },
  follower_since: { type: Date, default: Date.now() },
  block: { type: Boolean, default: false },
  mute: { type: Boolean, default: false },
});

module.exports = mongoose.model("Follower", followerSchema);
