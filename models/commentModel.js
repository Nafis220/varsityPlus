const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  post: { type: mongoose.Types.ObjectId, ref: "Story" },
  comment: { type: String, required: true },
});
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
