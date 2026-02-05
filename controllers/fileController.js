const multer = require("multer");
const { v4: uuid } = require("uuid");
const s3 = require("../config/s3");
const File = require("../models/File");

/* ================= MULTER ================= */

exports.uploadMiddleware = multer({
  storage: multer.memoryStorage(),
});


/* ================= GET FILES ================= */

exports.getFiles = async (req, res) => {

  const parent = req.query.parent || null;

  const files = await File.find({
    userId: req.user.id,
    parentId: parent
  });

  res.json(files);
};


/* ================= GET FOLDERS ================= */

exports.getFolders = async (req, res) => {

  const folders = await File.find({
    userId: req.user.id,
    isFolder: true
  });

  res.json(folders);
};


/* ================= CREATE FOLDER ================= */

exports.createFolder = async (req, res) => {

  const folder = await File.create({
    name: req.body.name,
    isFolder: true,
    parentId: req.body.parentId || null,
    userId: req.user.id
  });

  res.json(folder);
};


/* ================= UPLOAD FILE ================= */

exports.uploadFile = async (req, res) => {

  const file = req.file;

  const key = uuid() + "-" + file.originalname;

  await s3.upload({
    Bucket: process.env.AWS_BUCKET,
    Key: key,
    Body: file.buffer,
  }).promise();

  const newFile = await File.create({
    name: file.originalname,
    key,
    size: file.size,
    type: file.mimetype,
    parentId: req.body.parentId || null,
    userId: req.user.id
  });

  res.json(newFile);
};


/* ================= DELETE ================= */

exports.deleteFile = async (req, res) => {

  const file = await File.findById(req.params.id);

  if (file?.key) {
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET,
      Key: file.key,
    }).promise();
  }

  await File.findByIdAndDelete(req.params.id);

  res.json({ msg: "Deleted" });
};


/* ================= RENAME ================= */

exports.renameFile = async (req, res) => {

  await File.findByIdAndUpdate(req.params.id, {
    name: req.body.name
  });

  res.json({ msg: "Renamed" });
};
