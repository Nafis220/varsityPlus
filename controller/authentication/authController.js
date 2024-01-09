const { Student } = require("../../models/userModel");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const bcrypt = require("bcrypt");
const client = require("../../utilities/redis/redis");
const email = require("../../utilities/emailSender/email");
const nodeCron = require("node-cron");

const addUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const userInfo = {
    _id: req.body._id,
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
    role: req.body.role,
    bio: req.body.bio,
    DOB: {
      exactDate: new Date(req.body.DOB),
      date: new Date(req.body.DOB).getDate(),
      month: new Date(req.body.DOB).getMonth(),
      year: new Date(req.body.DOB).getFullYear(),
    },
  };

  try {
    newUser = new Student(userInfo);

    const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_TIMEOUT,
    });

    res.cookie(process.env.COOKIE_NAME, token, {
      maxage: process.env.JWT_TIMEOUT,
      httpOnly: true,
      signed: true,
    });

    await newUser.save();
    await client.setEx(
      "SignedUserInfo",
      process.env.REDIS_EXPIRES,
      JSON.stringify(userInfo)
    );

    res
      .status(200)
      .json({ message: "User Created Successfully", cookie: token });
  } catch (error) {
    console.log(error);
    if (req.body.userInfo.avatar) {
      const absolutePath = path.join(
        `${__dirname}../../../images/userImages/${req.body.userInfo.avatar}`
      );
      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
        } else {
          console.log("File deleted successfully");
        }
      });
    }

    res.status(500).json({ error: { auth: { message: error.message } } });
  }
};

const login = async (req, res) => {
  try {
    let user;
    const test = await client.get("SignedUserInfo");

    if (JSON.parse(test) != null && JSON.parse(test).email === req.body.email) {
      user = JSON.parse(await client.get("SignedUserInfo"));
    } else {
      user = await Student.findOne({ email: req.body.email });
      await client.setEx(
        "SignedUserInfo",
        process.env.REDIS_EXPIRES,
        JSON.stringify(user)
      );
    }

    if (user) {
      const checkPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );

      if (checkPassword) {
        userInfo = {
          _id: user._id,
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
          bio: user.bio,
          DOB: user.DOB.exactDate,
          avatar: user.avatar ? user.avatar : null,
        };

        const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
          expiresIn: process.env.JWT_TIMEOUT,
        });

        res.cookie(process.env.COOKIE_NAME, token, {
          maxage: process.env.JWT_TIMEOUT,
          httpOnly: true,
          signed: true,
        });

        res.status(200).json({
          success: { login: { message: "login successful" }, token: token },
        });
      } else {
        res
          .status(401)
          .json({ errors: { password: { message: "password is not valid" } } });
      }
    } else {
      res
        .status(404)
        .json({ errors: { login: { message: "User not found" } } });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ errors: { login: { message: "Internal server Error" } } });
  }
};

const forgetPassword = async (req, res) => {
  const requestedEmail = req.body.email;

  try {
    const registeredUser = await Student.findOne({ email: requestedEmail });

    if (registeredUser) {
      const resetToken = registeredUser.resetPasswordToken();
      await registeredUser.save({ validateBeforeSave: false });
      const resetUrl = `${req.protocol}://${req.get(
        "host"
      )}/auth/resetPassword/${resetToken}`;

      try {
        await email({
          email: requestedEmail,
          subject: "Pawwsord changed request received",
          message: `You have received a password reset token. Please use the below link to reset the password  \n\n ${resetUrl} \n\n This link will be valid for 10 minutes`,
        });
        res.status(200).json({
          message: "password reset link sent to the user link",
        });
      } catch (error) {
        console.log(error);
        registeredUser.passwordResetToken = undefined;
        registeredUser.passwordResetTokenExpires = undefined;
        res
          .status(500)
          .json({ error: "internal server error " + error.message });
      }
    } else {
      res.status(400).json({ message: "Provide a valid registered email" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const resetPassword = async (req, res) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  try {
    const requestedUser = await Student.findOne({
      passwordResetToken: token,
      passwordResetTokenExpires: { $gt: Date.now() },
    });

    if (requestedUser) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      requestedUser.password = hashedPassword;
      requestedUser.passwordResetToken = undefined;
      requestedUser.passwordResetTokenExpires = undefined;
      requestedUser.save();

      res.status(200).json({
        passwordReset: { message: "Password has been reset successfully" },
      });
    } else {
      res.status(400).json({ error: "token is invalid or expired" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.log(error);
  }
};
const birthdayNotification = async (req, res) => {
  try {
    const allUsers = await Student.find();

    if (allUsers.length > 0) {
      allUsers.map(async (user) => {
        if (
          user.DOB.date === new Date().getDate().toString() &&
          user.DOB.month === new Date().getMonth().toString()
        ) {
          await email({
            email: user.email,
            subject: "Birthday Wish",
            message: `It's your birthday. Happy birthday`,
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).json({ logout: { message: "Logout successful" } });
};
module.exports = {
  addUser,
  login,
  forgetPassword,
  resetPassword,
  birthdayNotification,
  logout,
};
