const mongoose = require("mongoose");

const messageSchema = mongoose.Schema(
  {
    receiver: { type: mongoose.Types.ObjectId, ref: "User" },
    receiverName: { type: String, required: true },
    sender: { type: mongoose.Types.ObjectId, ref: "User" },
    senderName: { type: String, required: true },
    message: { type: String, required: true },
  },
  { timestamps: true }
);
const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
