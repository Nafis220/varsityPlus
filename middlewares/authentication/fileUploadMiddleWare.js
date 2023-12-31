const bcrypt = require("bcrypt");
const uploader = require("../../utilities/fileUploads");
const handleFileUpload = (infoType, update) => {
  const fileUpload = async (req, res, next) => {
    if (infoType === "auth" && update === false && infoType != "story") {
      const upload = uploade("auth");
      upload.any("file")(req, res, async (error) => {
        if (error) {
          res.status(400).json({
            error: {
              fileUpload: {
                message: `Failed to upload the file because ${error.message}`,
              },
            },
          });
        } else {
          const hashedPassword = await bcrypt.hash(req.body.password, 10);

          userInfo = req.body.avatar[0]
            ? {
                ...req.body,
                avatar: req.body.avatar[0],
                password: hashedPassword,
              }
            : { ...req.body, password: hashedPassword };

          req.body.userInfo = userInfo;
          next();
        }
      });
    } else if (infoType === "auth" && update === true && infoType != "story") {
      const upload = uploader("auth");
      upload.any("file")(req, res, async (error) => {
        if (error) {
          res.status(400).json({
            error: {
              fileUpload: {
                message: `Failed to upload the file because ${error.message}`,
              },
            },
          });
        } else {
          userInfo = req.body.avatar
            ? {
                ...req.body,
                avatar: req.body.avatar[0],
              }
            : { ...req.body };

          req.body.userInfo = userInfo;
          next();
        }
      });
    } else if (infoType === "story" && infoType != "auth") {
      const upload = uploader("story");
      upload.any("files")(req, res, async (error) => {
        if (error) {
          res.status(400).json({
            error: {
              fileUpload: {
                message: `Failed to upload the files because ${error.message}`,
              },
            },
          });
        } else {
          storyInfo =
            req.body.avatar.length > 0
              ? {
                  ...req.body,
                  images: req.body.avatar,
                }
              : { ...req.body };
          req.body.storyInfo = storyInfo;

          next();
        }
      });
    }
  };
  return fileUpload;
};
module.exports = handleFileUpload;
