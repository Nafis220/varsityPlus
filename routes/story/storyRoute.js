const {
  publishStory,
  getStories,
  getOneStory,
  getOwnStory,
  updateStory,
  friendStory,
  deleteOwnStory,
  deleteOneStory,
  deletebyUserId,
  likePost,
} = require("../../controller/story/storyController");
const checkRole = require("../../middlewares/user/checkUserRole");
const checkLogin = require("../../middlewares/user/checkLogin");
const route = require("express").Router();
//1: user can upload story, file upload is yet to be done
route.post("/postStory", publishStory);
//2: admin and moderator can find all stories
route.get("/getStories", checkRole("moderatorTask"), getStories);
//3: any user can see a specific post using tag
route.get("/getOneStory", checkLogin, getOneStory);
//4: any user can see his/her own post/ posts
route.get("/getOwnStory", checkLogin, getOwnStory);
//5: user can update the story, or the subject or both and if subject is changed the tag will change automatically
route.put("/updateStory", checkLogin, updateStory);
//6: admin or moderator can delete a story using query
route.delete(
  "/deleteOneStory",
  checkLogin,
  checkRole("moderatorTask"),
  deleteOneStory
);
//7: only admin can delete all the story on a specific user
route.delete("/deletebyUserId", checkLogin, checkRole(), deletebyUserId);
//8: user can see other user's story if they are friend
route.get("/friendStory", checkLogin, friendStory);
//9: user can delete own story
route.delete("/deleteOwnStory", checkLogin, deleteOwnStory);
//10:user can like to friend's story
route.put("/likeStory", checkLogin, likePost);
module.exports = route;
