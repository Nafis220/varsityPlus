const { Student } = require("../../models/userModel");
const { Post } = require("../../routes/friend/friendRoute");
const Friend = require("../../models/friendModel");
const cookiesToUser = require("../../utilities/common/cookiesToUser");
const Story = require("../../models/postModel");
const sendRequest = async (req, res) => {
  const searchProperty = req.body.email ? req.body.email : req.body.name;

  try {
    const userInfo = await Student.findOne({
      $or: [{ email: searchProperty }, { name: searchProperty }],
    });
    if (userInfo) {
      const receiver_id = userInfo._id;
      const receiverName = userInfo.name;
      const senderInfo = cookiesToUser(req.signedCookies);
      const serder_id = senderInfo._id;
      const senderName = senderInfo.name;
      const friendshipObj = {
        sender: serder_id,
        senderName: senderName,
        receiver: receiver_id,
        receiverName: receiverName,
      };
      const friendshipInfo = new Friend(friendshipObj);

      await friendshipInfo.save();

      res.status(200).json({
        success: { friend: { message: "request sent successfully" } },
      });
    } else {
      res
        .status(404)
        .json({ error: { friend: { message: "user not found" } } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};

const getAllRequests = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);

  try {
    const request = await Friend.find({ receiver: userInfo._id });

    if (
      request.map((req) => {
        req._id;
      })
    ) {
      res.status(200).json({
        success: {
          friend: {
            message: "People sent you friend request",
            requestId: request.map((data) => data._id),
            senderName: request.map((data) => data.senderName),
          },
        },
      });
    } else {
      res
        .status(404)
        .json({ error: { friend: "No friend request available" } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};

const processRequest = async (req, res) => {
  const reqId = req.query.sender;
  const userInfo = cookiesToUser(req.signedCookies);
  const id = userInfo._id;
  const processStatus = req.body.status;

  try {
    const request = await Friend.find({ receiver: id });

    if (
      request.map(
        (receiverDB) =>
          JSON.stringify(receiverDB.receiver) === JSON.stringify(id)
      )
    ) {
      await Friend.findOneAndUpdate({ _id: reqId }, { status: processStatus });

      res.status(200).json({
        success: {
          friend: {
            message: `Requested is ${processStatus} successfully`,
          },
        },
      });
    } else {
      res.status(401).json({
        failed: {
          friend: { message: "Request to update friend request was failed" },
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};
const allSentRequests = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);
  const sender = userInfo._id;

  try {
    const allsentRequest = await Friend.find({ sender: sender });
    const requests = [];
    allsentRequest.map((receiver) => requests.push(receiver.receiverName));
    res.status(200).json({
      success: {
        friend: {
          message: requests,
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};

const allFriends = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);
  const id = userInfo._id;
  try {
    const allFriends = await Friend.find({
      $or: [{ sender: id }, { receiver: id }],
    });

    let friends = [];

    allFriends.map((friend) => {
      if (friend.status === "accepted") {
        if (JSON.stringify(friend.sender) === JSON.stringify(id)) {
          friends.push(friend.receiverName);
        } else {
          friends.push(friend.senderName);
        }
      }
    });
    res.status(200).json({
      success: {
        friend: {
          message: { friends: friends },
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};

module.exports = {
  sendRequest,
  getAllRequests,
  processRequest,
  allSentRequests,
  allFriends,
};
