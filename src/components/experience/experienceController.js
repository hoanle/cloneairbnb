const Experience = require("./experienceModel");
const Tag = require("../tag/tagModel");
const fs = require("fs");
const cloudinary = require("../../services/cloudinary");

require("dotenv").config();

exports.createExperience = async function (req, res) {
  try {
    const { title, location, price, duration, description, tags } = req.body;
    if (!title || !description || !tags) {
      res.status(400).json({
        status: "NOT OK!",
        message: "Title, description, host and tags are required",
      });
    }

    const tagObj = await Tag.generateTags(tags);
    const exp = new Experience({
      title,
      location,
      price,
      duration,
      tags: tagObj,
      userId: req.user._id,
    });

    await exp.save();
    res.status(200).json({ status: "OK", data: exp }).send(exp);
  } catch (err) {
    res.status(400).json({ status: "NOT OK!", error: err.message }).send(err);
  }
};

exports.getExperiences = async function (req, res) {
  try {
    const exp = await Experience.find({});
    res.status(200).json({ status: "OK", data: exp });
  } catch (err) {
    res.status(400).json({ status: "NOT OK!", error: err.message });
  }
};

exports.uploadExpImages = async (req, res) => {
  const uploader = async (path) => await cloudinary.uploads(path, "Images");
  const urls = [];
  if (req.method === "POST") {
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }
    
    const exp = await Experience.findOne({ _id: req.body.id });
    exp.images.push(urls);
    await exp.save()
    res.status(200).json({
      message: "images uploaded successfully",
      data: urls,
    });
  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`,
    });
  }
};
