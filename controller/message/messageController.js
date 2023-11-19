const Friend = require("../../models/friendModel");
const Message = require("../../models/messageModel");
const { Student } = require("../../models/userModel");
const cookiesToUser = require("../../utilities/common/cookiesToUser");

const sendMessage = async (req, res) => {
  const searchProperty = req.query.userId;
  const message = req.body.message;
  try {
    const userInfo = await Student.findOne({
      _id: searchProperty,
    });

    if (userInfo) {
      const senderInfo = cookiesToUser(req.signedCookies);
      const receiver_id = userInfo._id;
      const receiverName = userInfo.name;
      const serder_id = senderInfo._id;
      const friendships = await Friend.find({ receiver: receiver_id });

      let test = [];

      if (Object.keys(friendships).length > 0) {
        friendships.map((friendship) => {
          friendStatus = friendship.status;
          test.push(JSON.stringify(friendship.sender));
        });

        if (test.includes(JSON.stringify(serder_id))) {
          const senderName = senderInfo.name;
          const messsageObj = {
            receiver: receiver_id,
            receiverName: receiverName,
            sender: serder_id,
            senderName: senderName,
            message: message,
          };
          const messageDetails = new Message(messsageObj);

          await messageDetails.save();

          res.status(200).json({
            success: { friend: { message: "message sent" } },
          });
        } else {
          res.status(400).json({
            message: `you are not a friend of this user`,
          });
        }
      } else {
        res.status(400).json({
          error: {
            message: {
              message: `you are not a friend of this user`,
            },
          },
        });
      }
    } else {
      res.status(404).json({
        error: {
          message: {
            message: `user not found`,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};
const updateMessage = async (req, res) => {
  const filter = req.query.messageId;
  const message = req.body.message ? req.body.message : null;

  let isMessage;
  try {
    isMessage = await Message.findOne({ _id: filter });

    if (isMessage != null || isMessage != undefined) {
      if (message != null || message != undefined) {
        await Message.findOneAndUpdate({ _id: filter }, { message: message });
        res.status(200).json({
          success: {
            story: { message: "message updated successfully" },
          },
        });
      } else {
        res.status(404).json({
          error: { story: { message: "Provide a new comment" } },
        });
      }
    } else {
      res.status(404).json({
        error: { story: { message: "comment not found" } },
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error: { story: { message: "internal server error" } },
    });
  }
};
const deleteMessage = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);
  const senderInfo = userInfo._id;
  const messageId = req.query.messageId;
  try {
    const message = await Message.find({ _id: messageId });

    if (Object.keys(message).length > 0) {
      if (
        message.map(
          (message) =>
            JSON.stringify(message.sender) === JSON.stringify(senderInfo)
        )
      ) {
        await Message.deleteOne({ _id: messageId });
        res.status(200).json({
          success: { story: { message: "Message deleted success" } },
        });
      } else {
        res.status(401).json({ error: { story: { error: "unauthorized" } } });
      }
    } else {
      res.status(400).json({ error: { story: { error: "not found" } } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};
const getConversation = async (req, res) => {
  const searchProperty = req.query.userId;

  try {
    const userInfo = await Student.findOne({
      _id: searchProperty,
    });

    if (userInfo) {
      const senderInfo = cookiesToUser(req.signedCookies);
      const receiver_id = userInfo._id;
      const serder_id = senderInfo._id;
      const friendships = await Friend.find({ receiver: receiver_id });

      let test = [];

      if (Object.keys(friendships).length > 0) {
        friendships.map((friendship) => {
          friendStatus = friendship.status;
          test.push(JSON.stringify(friendship.sender));
          test.push(JSON.stringify(friendship.receiver));
        });

        if (test.includes(JSON.stringify(serder_id))) {
          const senderMessages = await Message.find({ sender: serder_id });
          console.log(senderMessages);
          if (Object.keys(senderMessages).length > 0) {
            let allMessages = [];

            senderMessages.map((message) => {
              if (
                JSON.stringify(message.receiver) === JSON.stringify(receiver_id)
              ) {
                allMessages.push(message);
              }
            });
            res
              .status(200)
              .json({ success: { message: { message: allMessages } } });
          } else {
            res.status(400).json({
              message: `no message found`,
            });
          }
        } else {
          res.status(400).json({
            message: `you are not a friend of this user`,
          });
        }
      } else {
        res.status(400).json({
          error: {
            message: {
              message: `you are not a friend of this user`,
            },
          },
        });
      }
    } else {
      res.status(404).json({
        error: {
          message: {
            message: `user not found`,
          },
        },
      });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};

module.exports = { sendMessage, updateMessage, deleteMessage, getConversation };
