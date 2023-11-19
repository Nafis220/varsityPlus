const Comment = require("../../models/commentModel");
const Friend = require("../../models/friendModel");
const Story = require("../../models/postModel");
const cookiesToUser = require("../../utilities/common/cookiesToUser");

const postComment = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);
  const storyId = req.query.storyId;
  const comment = req.body.comment;
  try {
    const storyInfo = await Story.findOne({ _id: storyId });

    if (Object.keys(storyInfo).length > 0) {
      const storyAuthor = storyInfo.author;

      const friendshipInfo = await Friend.find({
        $or: [{ sender: storyAuthor }, { receiver: storyAuthor }],
      });

      if (
        friendshipInfo.map((info) => {
          info.status === "accepted";
        })
      ) {
        if (
          friendshipInfo.map((info) => {
            info.sender === userInfo._id || info.receiver === userInfo._id;
          })
        ) {
          const commentObj = new Comment({
            story: storyId,
            commenter: userInfo._id,
            comment: comment,
          });
          await commentObj.save();
          res.status(200).json({
            success: { story: { message: "Commented successfully" } },
          });
        } else {
          res.status(404).json({
            error: {
              story: { message: "you are not a friend of story author" },
            },
          });
        }
      } else {
        res.status(404).json({
          error: {
            story: { message: "you are not a friend of story author" },
          },
        });
      }
    } else {
      res.status(404).json({ error: { story: { error: "not found" } } });
    }
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};
const updateOwnComment = async (req, res) => {
  const filter = req.query.commentId;
  const comment = req.body.comment ? req.body.comment : null;

  let isComment;
  try {
    isComment = await Comment.findOne({ _id: filter });

    if (isComment != null || isComment != undefined) {
      if (comment != null || comment != undefined) {
        await Comment.findOneAndUpdate({ _id: filter }, { comment: comment });
        res.status(200).json({
          success: {
            story: { message: "comment updated successfully" },
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

const deleteOwnComment = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);
  const CommenterInfo = userInfo._id;
  const commentId = req.query.commentId;
  try {
    const comment = await Comment.find({ _id: commentId });

    if (Object.keys(comment).length > 0) {
      if (
        comment.map(
          (comment) =>
            JSON.stringify(comment.commenter) === JSON.stringify(CommenterInfo)
        )
      ) {
        await Comment.deleteOne({ _id: commentId });
        res.status(200).json({
          success: { story: { message: "Comment deleted success" } },
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
const deleteOneCommnet = async (req, res) => {
  const commentId = req.query.commentId;
  try {
    const comment = await Comment.find({ _id: commentId });
    if (Object.keys(comment).length > 0) {
      await Comment.deleteOne({ _id: commentId });
      res.status(200).json({
        success: { story: { message: "Comment deleted successfully" } },
      });
    } else {
      res.status(404).json({ error: { story: { message: "not found" } } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};

module.exports = {
  postComment,
  updateOwnComment,
  deleteOwnComment,
  deleteOneCommnet,
};
