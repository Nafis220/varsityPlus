const { Student } = require("../../models/userModel");
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
//delete a user.
const deleteUser = async (req, res) => {
  try {
    const deleteProperty = req.body.email ? req.body.email : req.body.name;
    await Student.deleteOne({
      $or: [{ email: deleteProperty }, { name: deleteProperty }],
    });
    res
      .status(200)
      .json({ success: { users: { message: "user deleted successfully" } } });
  } catch (error) {
    res
      .status(500)
      .json({ error: { users: { message: "internal error occurred" } } });
  }
};

const updateUser = async (req, res) => {
  const filter = req.body.email ? req.body.email : req.body.name;
  const update = req.body.emailUpdate
    ? req.body.emailUpdate
    : req.body.passwordUpdate;

  try {
    if (req.body.emailUpdate) {
      await Student.findOneAndUpdate(
        { $or: [{ name: filter }, { email: filter }] },
        { email: update },
        { returnOriginal: true }
      );
    } else {
      const hashedPassword = await bcrypt.hash(update, process.env.SALT);
      await Student.findOneAndUpdate(
        { $or: [{ name: filter }, { email: filter }] },
        { password: hashedPassword },
        { returnOriginal: true }
      );
    }
    res
      .status(200)
      .json({ success: { user: { message: "User updated successfully" } } });
  } catch (error) {
    res
      .status(500)
      .json({ error: { user: { message: "internal server error" } } });
  }
};

module.exports = { getUsers, deleteUser, updateUser };
