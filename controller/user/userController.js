const { Student } = require("../../models/userModel");
const userInfo = require("../../utilities/common/cookiesToUser");
const bcrypt = require("bcrypt");
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

module.exports = {
  getUsers,
  deleteUser,
  updateUser,
  deleteAccount,
  updateRole,
  getOneUser,
};
