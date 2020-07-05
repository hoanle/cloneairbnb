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
    languages,
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

  const exp = new Experience({...permits, userId: req.user._id, tags: tagsObj });

  if (images) {
    const item = await cloudinary.v2.uploader.upload(images, {
      use_filename: true,
    });
    exp.images.push({
      url: item.url,
      public_id: item.public_id,
    });
  }

  await exp.save();
  return res.status(200).json({ status: "OK", data: exp });
});

exports.getExperiences = catchAsync(async function (req, res) {
  const tags = req.query.tags;
  let experienceList;
  if (!tags) {
    experienceList = await Experience.find({}).populate("tags", "tag");
  } else {
    const tagArray = tags.split(",");
    const tagsObjects = await Tag.findTags(tagArray);
    const tagIds = tagsObjects.filter(Boolean).map((x) => x._id);
    experienceList = await Experience.find({ tags: { $in: tagIds } }).populate(
      "tags",
      "tag"
    );
  }
  res.status(200).json({ status: "OK", data: experienceList });
});

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