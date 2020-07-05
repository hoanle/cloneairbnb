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
    languages
  } = req.body;
  if (
    !title ||
    !description ||
    !tags ||
    !duration ||
    !location ||
    !price ||
    !languages
  ) {
    return next(
      new AppError(
        400,
        "Title, description, tags, duration, location, price and languages are required"
      )
    );
  }

  const tagsObj = await Tag.generateTags(tags);
  const permits = Experience.permits(req.body);

  const exp = new Experience({
    ...permits,
    userId: req.user._id,
    tags: tagsObj,
  });

  await exp.save();
  return res.status(200).json({
    status: "OK",
    data: exp,
  });
});

exports.getExperiences = catchAsync(async function (req, res) {
  const tags = req.query.tags;
  let experienceList;
  if (!tags) {
    experienceList = await Experience.find({})
      .populate("tags", "tag")
      .populate("userId", "name");
  } else {
    const tagArray = tags.split(",");
    const tagsObjects = await Tag.findTags(tagArray);
    const tagIds = tagsObjects.filter(Boolean).map((x) => x._id);
    experienceList = await Experience.find({ tags: { $in: tagIds } })
      .populate("tags", "tag")
      .populate("userId", "name");
  }
  res.status(200).json({ status: "OK", data: experienceList });
});

exports.uploadExpImages = async (req, res) => {
  console.log(req.files)
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
    exp.images.forEach(element => {
      exp.images.push(element)
    });
    // console.log(exp.images)
    await exp.save();
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
