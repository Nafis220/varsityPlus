const { Student } = require("../../models/userModel");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const client = require("../../utilities/redis/redis");
const addUser = async (req, res) => {
  const userInfo = req.body.userInfo;
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
    await client.set("SignedUserInfo", JSON.stringify(newUser), "EX", 60 * 5);
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
    if (await client.get("SignedUserInfo")) {
      user = JSON.parse(await client.get("SignedUserInfo"));
    } else {
      user = await Student.findOne({ email: req.body.email });
      await client.set(
        "SignedUserInfo",
        JSON.stringify(userInfo),
        "EX",
        60 * 5
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
          avatar: user.avatar ? user.avatar : null,
        };
        await client.set(
          "SignedUserInfo",
          JSON.stringify(userInfo),
          "EX",
          60 * 5
        );
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
    res
      .status(500)
      .json({ errors: { login: { message: "Internal server Error" } } });
  }
};

const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).json({ logout: { message: "Logout successful" } });
};

module.exports = { addUser, login, logout };
