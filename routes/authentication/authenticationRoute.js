const router = require("express").Router();
const {
  addUser,
  login,
  forgetPassword,
  resetPassword,
  logout,
} = require("../../controller/authentication/authController");
const handleFileUpload = require("../../middlewares/authentication/fileUploadMiddleWare");
const {
  userValidator,
} = require("../../middlewares/authentication/userValidator");

//1: user can sign up with name email pass and avatar,Date of Birth, bio and subsequently cookie is added. All his information is saved in redis cash
router.post("/signup", userValidator, handleFileUpload("auth", true), addUser);
//2: user can signin with email and password, cookie is added. All his/her information is saved in redis cash
router.post("/signin", login);
//3: this api will send the user password reset token, that will be valid till 10 minutes, email sending is handeled through mailtrap, so that dummmy emails can also be used in production mood
router.post("/forgetPassword", forgetPassword);

//4:Here the password will be changed if the password token is valid.
router.patch("/resetPassword/:token", resetPassword);

//7: user can logout, cookie is deleted
router.get("/logout", logout);

module.exports = router;
