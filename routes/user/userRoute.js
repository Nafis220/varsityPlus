const {
  getUsers,
  deleteUser,
  updateUser,
  deleteAccount,
  updateRole,
  getOneUser,
} = require("../../controller/user/userController");
const checkLogin = require("../../middlewares/user/checkLogin");
const checkRole = require("../../middlewares/user/checkUserRole");

const router = require("express").Router();

//1:only admin can get all users
router.get("/allUsers", checkRole(), getUsers);

//2:admin and moderator can get a user
router.get("/getOneUser", checkRole("moderatorTask"), getOneUser);

//3: student user can only update his name and password
router.put("/update", checkLogin, updateUser);

//4: only admin can change others' role
router.put("/updateRole", checkRole(), updateRole);

//5: only admin can delete any user
router.delete("/deleteUser", checkRole, deleteUser);

//6: student user can only delete his own account
router.delete("/deleteAccount", checkLogin, deleteAccount);

module.exports = router;
