const mongoose = require("mongoose");
const studentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
      minLength: 5,
      maxLength: 32,
    },
    email: { type: String, trim: true, required: true, lowercase: true },
    password: { type: String, required: true },
    avatar: { type: String },
    bio: {
      type: String,
      trim: true,
      minLength: 10,
      maxLength: 100,
    },
    role: {
      type: String,
      required: true,
      enum: ["admin", "moderator", "student"],
      default: "student",
    },
  },
  { timestamps: true }
);
const Student = mongoose.model("User", studentSchema);

module.exports = { Student };
