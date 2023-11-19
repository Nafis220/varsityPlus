const route = require("express").Router();
const checkLogin = require("../../middlewares/user/checkLogin");
const checkRole = require("../../middlewares/user/checkUserRole");
const {
  postComment,
  updateOwnComment,
  deleteOwnComment,
  deleteOneCommnet,
} = require("../../controller/comment/commentController");
//1:user can comment his friend's story
route.post("/postComment", checkLogin, postComment);
//2:user can update a comment through query parameter
route.put("/updateOwnComment", checkLogin, updateOwnComment);
//3:user can delete a comment
route.delete("/deleteOwnComment", checkLogin, deleteOwnComment);
//4: admin and moderator can delete a comment through comment id
route.delete("/deleteOneCommnet", checkRole("moderatorTask"), deleteOneCommnet);
module.exports = route;
