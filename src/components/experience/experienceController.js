const Experience = require("./experienceModel");
const Tag = require("../tag/tagModel");
const AppError = require("./../error/appError");
const Globals = require("./../../configs/Globals");

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
    groupSize,
  } = req.body;
  if (
    !title ||
    !description ||
    !tags ||
    !duration ||
    !location ||
    !price ||
    !languages ||
    !groupSize
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

exports.uploadExpImages = catchAsync(async (req, res, next) => {
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await cloudinary.uploads(path, "Images");
    urls.push(newPath);
    fs.unlinkSync(path);
  }

  const exp = await Experience.findOne({ _id: req.body.id });
  exp.images.forEach((element) => {
    exp.images.push(element);
  });
  await exp.save();
  res.status(200).json({
    message: "images uploaded successfully",
    data: urls,
  });
});

exports.searchExperiences = catchAsync(async (request, response, next) => {
  const {
    tags,
    priceMin,
    priceMax,
    durationMin,
    durationMax,
    languages,
    averageRatingMin,
    groupSizeMax,
    page,
  } = request.query;

  let queries = [];
  if (tags) {
    let tagArray = tags.split(",");
    const tagsObjects = await Tag.findTags(tagArray);
    const tagIds = tagsObjects.filter(Boolean).map((x) => x._id);
    let tagsQuery = { tags: { $in: tagIds } };
    queries.push(tagsQuery);
  }
  if (priceMin) {
    let priceMinQuery = { price: { $gte: priceMin } };
    queries.push(priceMinQuery);
  }
  if (priceMax) {
    let priceMaxQuery = { price: { $lte: priceMax } };
    queries.push(priceMaxQuery);
  }
  if (durationMin) {
    let durationMinQuery = { duration: { $gte: durationMin } };
    queries.push(durationMinQuery);
  }
  if (durationMax) {
    let durationMaxQuery = { duration: { $lte: durationMax } };
    queries.push(durationMaxQuery);
  }
  if (languages) {
    let lans = languages.split(",");
    let languagesQuery = { languages: { $in: lans } };
    queries.push(languagesQuery);
  }
  if (averageRatingMin) {
    let averageRatingQuery = { averageRating: { $gte: averageRating } };
    queries.push(averageRatingQuery);
  }
  if (groupSizeMax) {
    let groupSizeQuery = { groupSize: { $lte: groupSizeMax } };
    queries.push(groupSizeQuery);
  }

  console.log(queries);
  const finalQuery = queries.length == 0 ? {} : { $and: queries };
  const pageNum = page || 1;
  const skip = (pageNum - 1) * Globals.perPage;
  const experienceList = await Experience.find(finalQuery)
    .skip(skip)
    .limit(Globals.perPage)
    .populate("tags", "tag")
    .populate("host", "name");

  response.status(200).json({
    status: "success",
    data: experienceList,
  });
});

exports.getExperienceDetail = catchAsync(async (request, response, next) => {
  const  experienceId  = request.params.experienceId;

  if (!experienceId) {
    return next(new AppError(400, "Experience id is required"));
  }
  const experience = await Experience.findById(experienceId);

  if (!experience) {
    return next(
      new AppError(404, `Can not find experience with id ${experienceId}`)
    );
  }

  await experience
    .populate({
      path: "userId",
      select: "_id name",
    })
    .populate({
      path: "tags",
      select: "_id tag",
    })
    .execPopulate();

  response.status(200).json({
    status: "success",
    data: { experience },
  });
});
