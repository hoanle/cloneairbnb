const Experience = require("./experienceModel");
const Tag = require("../tag/tagModel");
const fs = require('fs');
const cloudinary = require('../../services/cloudinary')

require("dotenv").config();


exports.createExperience = async function (req, res) {
  try {
    const {
      title,
      location,
      price,
      duration,
      description,
      tags,
      images,
    } = req.body;
    if (!title || !description || !tags) {
      res.status(400).json({
        status: "NOT OK!",
        message: "Title, description, host and tags are required",
      });
    }
    const imageName = await images.split("/");
    cloudinary.v2.uploader.upload(images, { use_filename: true });

    const tagObj = await Tag.generateTags(tags);
    const exp = new Experience({
      title,
      location,
      price,
      duration,
      tags: tagObj,
      userId: req.user._id,
      images: `https://res.cloudinary.com/adenhall/image/upload/${
        imageName[imageName.length - 1]
      }`,
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
 console.log(req.body)
  const uploader = async (path) => await cloudinary.uploads(path, 'Images');

  if (req.method === 'POST') {
    const urls = []
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path)
      urls.push(newPath)
      fs.unlinkSync(path)
    }

    res.status(200).json({
      message: 'images uploaded successfully',
      data: urls
    })

  } else {
    res.status(405).json({
      err: `${req.method} method not allowed`
    })
  }
}
