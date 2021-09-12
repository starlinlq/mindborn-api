const mongoose = require("mongoose");

const followingSchema = mongoose.Schema({
  _id: { type: mongoose.Types.ObjectId, ref: "User" },
  following_id: { type: mongoose.Types.ObjectId, ref: "User" },
  following_since: { type: Date, default: Date.now() },
  block: { type: Boolean, default: false },
  mute: { type: Boolean, default: false },
});

module.exports = mongoose.model("Following", followingSchema);
