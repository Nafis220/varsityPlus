const {
  sendRequest,
  processRequest,
  getAllRequests,
  allSentRequests,
  allFriends,
} = require("../../controller/friend/FriendController");
const checkLogin = require("../../middlewares/user/checkLogin");

const route = require("express").Router();
//1: user can send friend request to other user
route.post("/sendRequest", checkLogin, sendRequest);
//2: user can get all the friend requests
route.get("/getAllRequest", checkLogin, getAllRequests);
//3 user can accept or decline the friend request using query parameter
route.put("/processRequest", checkLogin, processRequest);
//4: user can see how many requests he/she has send
route.get("/allSentRequests", checkLogin, allSentRequests);
//5: user can see how many friends he/she has
route.get("/allFriends", checkLogin, allFriends);

module.exports = route;
