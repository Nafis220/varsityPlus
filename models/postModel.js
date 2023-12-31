const mongoose = require("mongoose");

const storySchema = mongoose.Schema(
  {
    author: { type: mongoose.Types.ObjectId, ref: "User" },
    subject: { type: String, required: true },
    story: { type: String, required: true },
    tag: { type: String, required: true },
    images: [{ type: String }],
    likers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        default: null,
      },
    ],
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);
const Story = mongoose.model("Story", storySchema);
module.exports = Story;
