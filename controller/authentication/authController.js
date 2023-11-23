const { Student } = require("../../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const addUser = async (req, res) => {
  const userInfo = req.body.userInfo;

  newUser = new Student(userInfo);

  const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIMEOUT,
  });

  res.cookie(process.env.COOKIE_NAME, token, {
    maxage: process.env.JWT_TIMEOUT,
    httpOnly: true,
    signed: true,
  });
  try {
    await newUser.save();
    res
      .status(200)
      .json({ message: "User Created Successfully", cookie: token });
  } catch (error) {
    const absolutePath = path.join(
      `${__dirname}/../images/userImages/${req.body.userInfo.avatar}`
    );
    fs.unlink(absolutePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err.message}`);
      } else {
        console.log("File deleted successfully");
      }
    });
    res
      .status(500)
      .json({ error: { auth: { message: "internal server error" } } });
  }
};

const login = async (req, res) => {
  const user = await Student.findOne({ email: req.body.email });

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
    res.status(404).json({ errors: { login: { message: "User not found" } } });
  }
};

const logout = (req, res) => {
  res.clearCookie(process.env.COOKIE_NAME);
  res.status(200).json({ logout: { message: "Logout successful" } });
};

module.exports = { addUser, login, logout };
