const express = require("express");
const path = require("path");

// require multer
//* as we want to upload file we need to provide a envoironment to multer for file uploading
const multer = require("multer");

// declariong a variable and call multer function in it
//* this function takes obj as a parameter we can provide direction in it such as which forder we want to upload the file. in "dest" property we need to tell the in which folder we need to save the file

const FOLDER_PATH = "./FileUploads/";

// to take control over the storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FOLDER_PATH);
  },
  // to control the file name
  filename: (req, file, cb) => {
    // extracting the file extention of the file that will be uploaded using path module
    const fileExtention = path.extname(file.originalname);
    //  organizing the file name before saving it
    const fileName =
      file.originalname
        .replace(
          fileExtention,
          ""
        ) /* replacing file extention with empty string ""*/
        .toLowerCase()
        .split(
          " "
        ) /* all space will be replaced and it will create sseveral arrays*/
        .join("-") /* the arrays will be joined with highphen.*/ +
      "-" +
      Date.now();
    cb(null, fileName + fileExtention);
  },
});

const upload = multer({
  storage: storage,
  limit: {
    // fix the size of the file that will be uploaded
    fileSize: 1000000,
  },
  // restrict the a certain type of file from uploading
  fileFilter: (req, file, cb) => {
    if (something) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});
