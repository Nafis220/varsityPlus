const multer = require("multer");
const path = require("path");

const fileUpload = (type) => {
  let imageName = [];
  const fileLocation =
    type === "auth"
      ? path.join(`${__dirname}/../images/userImages`)
      : path.join(`${__dirname}/../images/storyImage`);
  const fileStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fileLocation);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
      imageName.push(Date.now() + "-" + file.originalname);

      req.body.avatar = imageName;
    },
  });

  const upload = multer({
    storage: fileStorageEngine,
    limits: {
      fileSize: 1024 * 1024 * 5, // 5 MB (adjust the limit as needed)
    },
  });
  return upload;
};
module.exports = fileUpload;
