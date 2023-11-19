const {
  sendMessage,
  updateMessage,
  deleteMessage,
  getConversation,
} = require("../../controller/message/messageController");

const route = require("express").Router();
route.post("/sendMessage", sendMessage);
route.put("/updateMessage", updateMessage);
route.delete("/deleteMessage", deleteMessage);
route.get("/getConversation", getConversation);
module.exports = route;
