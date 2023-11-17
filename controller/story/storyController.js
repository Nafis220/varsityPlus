const jwt = require("jsonwebtoken");
const Story = require("../../models/postModel");
const turnToTag = require("../../utilities/story/turnToTag");

const publishStory = async (req, res) => {
  const cookie = req.signedCookies;
  const token = cookie[process.env.COOKIE_NAME];
  const userInfo = jwt.verify(token, process.env.JWT_SECRET);
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
  const cookie = req.signedCookies;
  const token = cookie[process.env.COOKIE_NAME];
  const userInfo = jwt.verify(token, process.env.JWT_SECRET);
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
module.exports = {
  publishStory,
  getStories,
  getOneStory,
  getOwnStory,
  updateStory,
};
