const { check } = require("express-validator");
const { Student } = require("../models/userModel");
const createError = require("http-errors");

const userValidator = [
  check("name")
    .isLength({ min: 5 })
    .withMessage("name is required")
    .isAlpha("en-US", { ignore: " -" })
    .withMessage("must not contain anything other than aplphabates")
    .trim(),
  check("email")
    .isEmail()
    .trim()
    .custom(async (value) => {
      try {
        const user = await Student.findOne({ email: value });
        if (user) {
          createError("Email is already in use");
        }
      } catch (error) {
        createError(error.message);
      }
    }),
  check("password")
    .isStrongPassword()
    .withMessage(
      "Password must be at least 8 characters long and should atleast one lowercase, one uppercase, one symbol and one number"
    ),
];

module.exports = { userValidator };
