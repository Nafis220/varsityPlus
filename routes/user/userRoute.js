const {
  getUsers,
  deleteUser,
  updateUser,
} = require("../../controller/user/userController");
const checkLogin = require("../../middlewares/user/checkLogin");
const checkRole = require("../../middlewares/user/checkUserRole");

const router = require("express").Router();

router.get("/allUsers", checkRole, getUsers);
router.delete("/deleteUser", checkRole, deleteUser);
router.put("/update", checkLogin, updateUser);
module.exports = router;
