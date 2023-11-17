const router = require("express").Router();
const {
  addUser,
  login,
  logout,
} = require("../../controller/authentication/authController");
const handleFileUpload = require("../../middlewares/authentication/fileUploadMiddleWare");
const {
  userValidator,
} = require("../../middlewares/authentication/userValidator");

//1: user can sign up with name email pass and avatar, cookie is added
router.post("/signup", userValidator, handleFileUpload, addUser);
//2: user can signin with email and password, cookie is added
router.get("/signin", login);
//3: user can logout, cookie is deleted
router.get("/logout", logout);

module.exports = router;
