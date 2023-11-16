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

router.post("/signup", userValidator, handleFileUpload, addUser);
router.get("/signin", login);
router.get("/logout", logout);
// userValidator
module.exports = router;
