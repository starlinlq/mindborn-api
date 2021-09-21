const { Schema, model, Types } = require("mongoose");

const NotificaitonSchema = new Schema(
  {
    sender: { type: Types.ObjectId, ref: "User" },
    reciever: { type: Types.ObjectId, ref: "User" },
    notification: { type: String },
    belongsTo: { type: String },
    is_read: { type: Boolean, default: false },
    type: { type: String },
  },
  { timestamps: true }
);

module.exports = model("Notification", NotificaitonSchema);
