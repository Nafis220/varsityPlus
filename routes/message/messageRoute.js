const {
  sendMessage,
  updateMessage,
  deleteMessage,
  getConversation,
} = require("../../controller/message/messageController");

const route = require("express").Router();

//1: user can send to his/her friend
route.post("/sendMessage", sendMessage);
// 2: user can update his/her message
route.put("/updateMessage", updateMessage);
//3: user can delete his/her message
route.delete("/deleteMessage", deleteMessage);
//4: user can get all the message that he/she has send to a specific user
route.get("/getConversation", getConversation);
module.exports = route;
