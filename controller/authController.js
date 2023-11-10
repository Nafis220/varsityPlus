const bcrypt = require("bcrypt");
const { Student } = require("../models/userModel");

const addUser = async (req, res) => {
  let newUserData;
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  if (req.body.files && req.body.files.length) {
    newUser = new Student({
      ...req.body,
      avatar: req.body.files[0],
      password: hashedPassword,
    });
  } else {
    newUser = new Student({
      ...req.body,
      password: hashedPassword,
    });
  }

  try {
    await newUser.save();
    res.status(200).json({ message: "User Created Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = { addUser };
