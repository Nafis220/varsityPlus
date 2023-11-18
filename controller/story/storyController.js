const jwt = require("jsonwebtoken");
const Story = require("../../models/postModel");
const turnToTag = require("../../utilities/story/turnToTag");
const cookiesToUser = require("../../utilities/common/cookiesToUser");
const Friend = require("../../models/friendModel");

const publishStory = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);
  const { subject, story } = req.body;
  const newArray = subject.split(" ");
  const firstLetters = newArray.map((word) => word.charAt(0).toUpperCase());
  const storyTag = `#${firstLetters.join("")}`;

  const storyInfo = new Story({
    author: userInfo._id,
    subject: subject,
    story: story,
    tag: storyTag,
  });

  try {
    await storyInfo.save();
    res
      .status(201)
      .json({ success: { story: { message: "Story is saved successfully" } } });
  } catch (error) {
    res.status(500).json({
      error: { story: { message: "internal server error" } },
    });
  }
};

const getStories = async (req, res) => {
  try {
    const allStories = await Story.find();
    res.status(200).json({ success: { story: { message: allStories } } });
  } catch (error) {
    res.status(500).json({
      error: { story: { message: "internal server error" } },
    });
  }
};
const getOneStory = async (req, res) => {
  const filter = req.body.tag;
  try {
    const story = await Story.findOne({ tag: filter });
    res.status(200).json({ success: { story: { message: story } } });
  } catch (error) {
    res.status(500).json({
      error: { story: { message: "internal server error" } },
    });
  }
};
const getOwnStory = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);
  const filter = userInfo._id;
  try {
    const story = await Story.find({ author: filter });
    res.status(200).json({ success: { story: { message: story } } });
  } catch (error) {
    res.status(500).json({
      error: { story: { message: "internal server error" } },
    });
  }
};
const updateStory = async (req, res) => {
  const filter = req.body.tag;
  const subject = req.body.subject ? req.body.subject : null;
  const story = req.body.story ? req.body.story : null;
  let isStory;
  try {
    isStory = await Story.findOne({ tag: filter });
  } catch (error) {
    res
      .status(500)
      .json({ error: { story: { message: "internal server error" } } });
  }
  if (isStory) {
    try {
      if (story && subject) {
        const tag = turnToTag(subject);
        await Story.findOneAndUpdate(
          { tag: filter },
          { subject: subject, story: story, tag: tag }
        );
        res.status(200).json({
          success: {
            story: { message: "story and subject updated successfully" },
          },
        });
      } else if (story) {
        await Story.findOneAndUpdate({ tag: filter }, { story: story });
        res.status(200).json({
          success: {
            story: { message: "story updated successfully" },
          },
        });
      } else {
        const tag = turnToTag(subject);
        await Story.findOneAndUpdate(
          { tag: filter },
          { subject: subject, tag: tag }
        );
        res.status(200).json({
          success: {
            story: { message: "subject updated successfully" },
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        error: { story: { message: "internal server error" } },
      });
    }
  } else {
    res.status(404).json({
      error: { story: { message: "post not found" } },
    });
  }
};
const friendStory = async (req, res) => {
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
          friends.push(friend.receiver);
        } else {
          friends.push(friend.sender);
        }
      }
    });
    let stories = [];

    stories = await Story.find({ author: friends });
    res.status(200).json({
      success: {
        friend: {
          message: { stories: stories },
        },
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};
const deleteOwnStory = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);
  const authorId = userInfo._id;
  const postId = req.query.story;
  try {
    const post = await Story.find({ _id: postId });
    if (
      post.map(
        (post) => JSON.stringify(post.author) === JSON.stringify(authorId)
      )
    ) {
      await Story.deleteOne({ _id: postId });
      res
        .status(200)
        .json({ success: { story: { message: "User deleted success" } } });
    } else {
      res.status(401).json({ error: { story: { error: "unauthorized" } } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};
const deleteOneStory = async (req, res) => {
  const postId = req.query.story;
  try {
    const post = await Story.find({ _id: postId });
    if (Object.keys(post).length > 0) {
      await Story.deleteOne({ _id: postId });
      res.status(200).json({
        success: { story: { message: "Story deleted successfully" } },
      });
    } else {
      res.status(404).json({ error: { story: { error: "not found" } } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};

const deletebyUserId = async (req, res) => {
  const author = req.query.userId;
  try {
    const post = await Story.find({ author: author });

    if (Object.keys(post).length > 0) {
      await Story.deleteMany({ author: author });
      res.status(200).json({
        success: { story: { message: "All story deleted successfully" } },
      });
    } else {
      res.status(404).json({ error: { story: { error: "not found" } } });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: { friend: { message: "internal server error" } } });
  }
};
const likePost = async (req, res) => {
  const userInfo = cookiesToUser(req.signedCookies);
  const storyId = req.query.storyId;
  try {
    const storyInfo = await Story.findOne({ _id: storyId });

    if (Object.keys(storyInfo).length > 0) {
      const storyAuthor = storyInfo.author;

      const friendshipInfo = await Friend.find({
        $or: [{ sender: storyAuthor }, { receiver: storyAuthor }],
      });

      let friendShipDetails; // every doc where there the author exists
      //map and get the accepted doc

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
          console.log(storyInfo.likes);
          const newLiker = userInfo._id;
          const likersArray = [newLiker];
          const likeCount = storyInfo.likes + 1;
          console.log(likersArray, newLiker);
          await Story.findOneAndUpdate(
            { _id: storyId },
            { likers: likersArray, likes: likeCount }
          );

          res.status(200).json({
            success: { story: { message: "Like sent successfully" } },
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

module.exports = {
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
};
