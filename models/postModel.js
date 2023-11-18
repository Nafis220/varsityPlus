const mongoose = require("mongoose");

const storySchema = mongoose.Schema({
  author: { type: mongoose.Types.ObjectId, ref: "User" },
  subject: { type: String, required: true },
  story: { type: String, required: true },
  tag: { type: String, required: true },
  likers: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  likes: { type: Number, default: 0, required: true },
});
const Story = mongoose.model("Story", storySchema);
module.exports = Story;
//   likes: [{ type: Schema.Types.ObjectId, ref: "Student" }],
//   comments: [{ type: Schema.Types.ObjectId, ref: "Student" }],
// coverImages
