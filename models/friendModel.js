const mongoose = require("mongoose");
const friendSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    senderName: { type: String, required: true },
    receiver: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    receiverName: { type: String, required: true },
    status: {
      type: String,
      enum: ["accepted", "declined", "pending"],
      default: "pending",
      required: true,
    },
  },
  { timeStamps: true }
);
const Friend = mongoose.model("Friend", friendSchema);
module.exports = Friend;
