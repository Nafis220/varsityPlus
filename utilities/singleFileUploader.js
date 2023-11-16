const multer = require("multer");
const express = require("express");
const path = require("path");
const createError = require("http-errors");
//folder, max_size, allowed_file_type, errorMessage

const uploader = () => {
  const fileDestination = path.join(`${__dirname}../../FileUploads`);
  const diskStorageEngine = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, fileDestination);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  });

  const storage = multer({
    storage: diskStorageEngine,
  });
  return storage;
};
module.exports = uploader;
