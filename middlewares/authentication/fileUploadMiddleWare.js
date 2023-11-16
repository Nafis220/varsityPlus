const uploader = require("../../utilities/singleFileUploader");

const handleFileUpload = (req, res, next) => {
  const upload = uploader();
  upload.single("image")(req, res, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ errors: { avatar: { message: error.message } } });
    } else {
      next();
    }
  });
};
module.exports = handleFileUpload;
