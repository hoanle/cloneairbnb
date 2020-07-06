const Experience = require("./experienceModel");
const Tag = require("../tag/tagModel");
const AppError = require("./../error/appError");

const { catchAsync } = require("./../error/errorController");
const fs = require("fs");
const cloudinary = require("./../../services/cloudinary");




exports.createExperience = catchAsync(async function (req, res, next) {
  const {
    title,
    location,
    price,
    duration,
    description,
    tags,
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

  const exp = new Experience({
    ...permits,
    userId: req.user._id,
    tags: tagsObj,
  });

  if (req.files) {
    let urls = await cloudinary.uploadsMultiFiles(req.files, "Images");
    exp.images = urls;
  }

  await exp.save();
  return res.status(200).json({
    status: "OK",
    data: exp,
  });
});



const MAX_ITEMS= 10;

exports.getExperiences = catchAsync(async function (req, res) {
  const page = req.query.page || 1;
  const minPrice = req.query.minPrice;
  const maxPrice = req.query.maxPrice;
  const tags = req.query.tags;
  let experienceList;
  if (!tags) {
    experienceList = await Experience.find({
      price: {$gt: minPrice, $lt: maxPrice}
    })
      .populate("tags", "tag")
      .populate("userId", "name")
      .limit(MAX_ITEMS)
      .skip((page-1)*MAX_ITEMS);
  } else {
    const tagArray = tags.split(",");
    const tagsObjects = await Tag.findTags(tagArray);
    const tagIds = tagsObjects.filter(Boolean).map((x) => x._id);
    experienceList = await Experience.find({ tags: { $in: tagIds }, price: {$gt: minPrice, $lt: maxPrice} })
      .populate("tags", "tag")
      .populate("userId", "name")
      .limit(MAX_ITEMS)
      .skip((page-1)*MAX_ITEMS);
  }
  const numDocuments = await Experience.countDocuments();
  res.status(200).json({ status: "OK", data: experienceList, maxPageNum: Math.ceil(numDocuments / MAX_ITEMS) });
});

exports.uploadExpImages = catchAsync(async (req, res, next) => {
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await cloudinary.uploadSingleFile(path, "Images");
    urls.push(newPath);
    fs.unlinkSync(path);
  }

  const exp = await Experience.findOne({ _id: req.body.id });
  urls.map(x => exp.images.push(x));
  await exp.save();
  res.status(200).json({
    message: "images uploaded successfully",
    data: urls,
  });
});
