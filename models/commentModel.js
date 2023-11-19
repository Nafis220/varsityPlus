const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
  {
    story: { type: mongoose.Types.ObjectId, ref: "Story" },
    commenter: { type: mongoose.Types.ObjectId, ref: "User" },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
