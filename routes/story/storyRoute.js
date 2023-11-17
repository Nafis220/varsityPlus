const {
  publishStory,
  getStories,
  getOneStory,
  getOwnStory,
  updateStory,
} = require("../../controller/story/storyController");
const checkRole = require("../../middlewares/user/checkUserRole");
const checkLogin = require("../../middlewares/user/checkLogin");
const route = require("express").Router();
// user can upload story, file upload is yet to be done
route.post("/postStory", publishStory);
// admin and moderator can find all stories
route.get("/getStories", checkRole("moderatorTask"), getStories);
// any user can see a specific post using tag
route.get("/getOneStory", checkLogin, getOneStory);
// any user can see his/her own post/ posts
route.get("/getOwnStory", checkLogin, getOwnStory);
// user can update the story, or the subject or both and if subject is changed the tag will change automatically
route.put("/updateStory", checkLogin, updateStory);
module.exports = route;
