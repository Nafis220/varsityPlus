const { Student } = require("../../models/userModel");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const cookiesToUser = require("../../utilities/common/cookiesToUser");
const jwt = require("jsonwebtoken");

const getUsers = async (req, res) => {
  try {
    const allUsers = await Student.find();
    res.status(200).json({ success: { users: allUsers } });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: { users: { message: "internal server error" } } });
  }
};

const getOneUser = async (req, res) => {
  const searchProperty = req.body.email ? req.body.email : req.body.name;

  try {
    const userInfo = await Student.findOne({
      $or: [{ email: searchProperty }, { name: searchProperty }],
    });
    res.status(200).json({ success: { users: userInfo } });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: { users: { message: "internal server error" } } });
  }
};

//delete a user.
const deleteUser = async (req, res) => {
  try {
    const deleteProperty = req.body.email ? req.body.email : req.body.name;
    await Student.deleteOne({
      $or: [{ email: deleteProperty }, { name: deleteProperty }],
    });
    res.status(200).json({
      success: {
        users: { message: `${deleteProperty} deleted successfully` },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: { users: { message: "internal error occurred" } } });
  }
};

const updateUser = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);

  const filter = userInfo.email;
  const update = req.body.name ? req.body.name : req.body.password;

  try {
    if (req.body.name) {
      await Student.findOneAndUpdate(
        { email: filter },
        { name: update },
        { returnOriginal: true }
      );
    } else {
      const hashedPassword = await bcrypt.hash(update, 10);
      await Student.findOneAndUpdate(
        { email: filter },
        { password: hashedPassword },
        { returnOriginal: true }
      );
    }
    res
      .status(200)
      .json({ success: { user: { message: "User updated successfully" } } });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: { user: { message: "internal server error" } } });
  }
};

const deleteAccount = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);

  const email = userInfo.email;
  try {
    const deleted = await Student.deleteOne({ email: email });

    res.status(200).json({
      success: {
        user: { message: `${deleted.deletedCount} User deleted Successfully` },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: { user: { message: "internal server error" } } });
  }
};

const updateRole = async (req, res) => {
  const filter = req.body.email;
  const updatedRole = req.body.role;
  try {
    await Student.findOneAndUpdate(
      { email: filter },
      { role: updatedRole },
      { returnOriginal: true }
    );
    res.status(200).json({
      success: {
        user: {
          message: `${filter}'s role is changed to ${updatedRole} successfully`,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: { user: { message: "internal server error" } } });
  }
};
const updateProfileInfo = async (req, res) => {
  const updatedName = req.body.userInfo.name ? req.body.userInfo.name : null;
  const updatedBio = req.body.userInfo.bio ? req.body.userInfo.bio : null;
  const avatarUpdate = req.body.userInfo.avatar
    ? req.body.userInfo.avatar
    : null;
  const userInfo = cookiesToUser(req.signedCookies);

  const email = userInfo.email;

  if (updatedName && !updatedBio && !avatarUpdate) {
    try {
      await Student.findOneAndUpdate(
        { email: email },
        { name: updatedName },
        { returnOriginal: true }
      );

      const newUserInfo = {
        _id: userInfo._id,
        name: updatedName,
        email: userInfo.email,
        password: userInfo.password,
        role: userInfo.role,
        avatar: userInfo.avatar ? user.avatar : null,
      };
      const token = jwt.sign(newUserInfo, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
      });

      res.cookie(process.env.COOKIE_NAME, token, {
        maxage: process.env.JWT_TIMEOUT,
        httpOnly: true,
        signed: true,
      });
      res.status(200).json({ message: "Name updated Successfully" });
    } catch (error) {
      console.log(error);
      res.ststus(500).json({ error: error.message });
    }
  } else if (updatedName && updatedBio && !avatarUpdate) {
    try {
      await Student.bulkWrite([
        {
          updateOne: {
            filter: { email: email },
            update: { $set: { name: updatedName } },
          },
        },
        {
          updateOne: {
            filter: { email: email },
            update: { $set: { bio: updatedBio } },
          },
        },
      ]);
      const newUserInfo = {
        _id: userInfo._id,
        name: updatedName,
        email: userInfo.email,
        password: userInfo.password,
        role: userInfo.role,
        avatar: userInfo.avatar ? user.avatar : null,
        bio: updatedBio,
      };
      const token = jwt.sign(newUserInfo, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
      });

      res.cookie(process.env.COOKIE_NAME, token, {
        maxage: process.env.JWT_TIMEOUT,
        httpOnly: true,
        signed: true,
      });
      res.status(200).json({ message: "name and bio updated Successfully" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else if (updatedName && updatedBio && avatarUpdate) {
    try {
      const absolutePath = path.join(
        `${__dirname}../../../images/userImages/${userInfo.avatar}`
      );

      fs.unlink(absolutePath, (err) => {
        if (err) {
          console.error(`Error deleting file: ${err.message}`);
        } else {
          console.log("File deleted successfully");
        }
      });
      await Student.bulkWrite([
        {
          updateOne: {
            filter: { email: email },
            update: { $set: { name: updatedName } },
          },
        },
        {
          updateOne: {
            filter: { email: email },
            update: { $set: { bio: updatedBio } },
          },
        },
        {
          updateOne: {
            filter: { email: email },
            update: { $set: { avatar: avatarUpdate } },
          },
        },
      ]);
      const newUserInfo = {
        _id: userInfo._id,
        name: updatedName,
        email: userInfo.email,
        password: userInfo.password,
        role: userInfo.role,
        avatar: avatarUpdate,
        bio: updatedBio,
      };
      const token = jwt.sign(newUserInfo, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_TIMEOUT,
      });

      res.cookie(process.env.COOKIE_NAME, token, {
        maxage: process.env.JWT_TIMEOUT,
        httpOnly: true,
        signed: true,
      });
      res
        .status(200)
        .json({ message: "Name, Bio and Avatar updated Successfully" });
    } catch (error) {
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
      res
        .status(500)
        .json({ error: { auth: { message: "internal server error" } } });
    }
  } else {
    res.status(400).json({ error: "Invalid Info Provided" });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  updateUser,
  deleteAccount,
  updateRole,
  getOneUser,
  updateProfileInfo,
};
