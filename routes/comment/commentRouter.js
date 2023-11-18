const route = require("express").Router();
const { postComment } = require("../../controller/comment/commentController");
route.post("/postComment", postComment);
module.exports = route;
