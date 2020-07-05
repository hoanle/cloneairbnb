const Experience = require("./experienceModel");
const Tag = require("../tag/tagModel");
const AppError = require("./../error/appError");

const { catchAsync } = require("./../error/errorController");
const fs = require("fs");
const cloudinary = require("../../services/cloudinary");

exports.createExperience = catchAsync(async function (req, res, next) {
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
    return next(
      new AppError(400, "Title, description, host and tags are required")
    );
  }

  const tagsObj = await Tag.generateTags(tags);
  const exp = new Experience({
    title,
    location,
    price,
    duration,
    tags: tagsObj,
    description: description,
    userId: req.user._id,
  });

  if (images) {
    const imageName = images.split("/");
    const item = await cloudinary.v2.uploader.upload(images, {
      use_filename: true,
    });
    exp.images.push({
      url: item.url,
      public_id: item.public_id,
    });
  }

  await exp.save();
  res.status(200).json({ status: "OK", data: exp }).send(exp);
});

exports.getExperiences = async function (req, res) {
  try {
    const exp = await Experience.find({});
    res.status(200).json({ status: "OK", data: exp });
  } catch (err) {
    res.status(400).json({ status: "NOT OK!", error: err.message });
  }
};

exports.uploadExpImages = async (req, res) => {
  console.log(req.body);
  const uploader = async (path) => await cloudinary.uploads(path, "Images");

  if (req.method === "POST") {
    const urls = [];
    const files = req.files;
    for (const file of files) {
      const { path } = file;
      const newPath = await uploader(path);
      urls.push(newPath);
      fs.unlinkSync(path);
    }

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
