const router = require("express").Router();
const { addUser } = require("../controller/authController");
const { userValidator } = require("../middlewares/userValidator");

router.post("/", userValidator, addUser);

module.exports = router;
