const Experience = require("./experienceModel");
const Tag = require("../tag/tagModel")
require('dotenv').config()
const cloudinary = require('cloudinary');
cloudinary.config({ 
  cloud_name: 'adenhall', 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});


exports.createExperience = async function (req, res) {
  try {
    const { title, country, price, duration, rating, description, tags, imagePath } = req.body;
    if (!title || !description || !tags) {
      res.status(400).json({
        status: "NOT OK!",
        message: "Title, description, host and tags are required",
      });
    }
    const imageName = await imagePath.split('/')
    console.log(imageName)
    const tagObj = await Tag.generateTags(tags);
    const exp = new Experience({
      title,
      country,
      price,
      duration,
      rating,
      tags: tagObj,
      host: req.user._id,
      imagePath: `https://res.cloudinary.com/adenhall/image/upload/${imageName[imageName.length-1]}`
    });
    cloudinary.v2.uploader.upload(imagePath, {use_filename: true});
    await exp.save();
    res.status(200).json({ status: "OK", data: exp }).send(exp);
  } catch (err) {
    res.status(400).json({ status: "NOT OK!", error: err.message }).send(err);
  }
};
exports.getExperience = async function (req, res) {
  try {
    const exp = await Experience.find();
    res.status(200).json({status: "OK", data: exp})
  } catch (err) {
    res.status(400).json({status: "NOT OK!", error: err.message})
  }
}