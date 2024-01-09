const mongoose = require("mongoose");
const crypto = require("crypto");
const { log } = require("console");
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
    DOB: {
      exactDate: { type: Date, required: true },
      date: { type: String, required: true },
      month: { type: String, required: true },
      year: { type: String, required: true },
    },
    passwordResetToken: String,
    passwordResetTokenExpires: Date,
  },
  { timestamps: true }
);

studentSchema.methods.resetPasswordToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetTokenExpires = Date.now() + 10 * 60 * 1000;
  console.log(
    "reset token" + resetToken,
    "hashed token" + this.passwordResetToken
  );
  return resetToken;
};

const Student = mongoose.model("User", studentSchema);

module.exports = { Student };
