const Experience = require("./experienceModel");
const Tag = require("../tag/tagModel");
const User = require("./../user/userModel");
const AppError = require("./../error/appError");
const Globals = require("./../../configs/Globals");
const faker = require("faker");
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
  console.log(tags)
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
      .sort({ updatedAt: -1 })
      .populate("tags", "tag")
      .populate("userId", "name");
  } else {
    const tagArray = tags.split(",");
    const tagsObjects = await Tag.findTags(tagArray);
    const tagIds = tagsObjects.filter(Boolean).map((x) => x._id);
    experienceList = await Experience.find({ tags: { $in: tagIds } })
      .sort({ updatedAt: -1 })
      .populate("tags", "tag")
      .populate("userId", "name");
  }
  const maxNumber = await Experience.countDocuments();
  console.log(maxNumber);
  res.status(200).json({ status: "OK", data: { experienceList, maxNumber } });
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
    perPage,
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
  const finalQuery = queries.length == 0 ? {} : { $and: queries };
  const pageNum = parseInt(page) || 1;
  const perPageNum = parseInt(perPage) || Globals.perPage;
  const skip = (pageNum - 1) * perPageNum;
  const experienceList = await Experience.find(finalQuery)
    .skip(skip)
    .limit(perPageNum)
    .populate("tags", "tag")
    .populate("host", "name");
   
  const maxCount = await Experience.count(finalQuery);
  const totalPages = Math.floor((maxCount - 1) / perPageNum) + 1;
  let pagination = { pageNum, perPageNum, totalPages };
  response.status(200).json({
    status: "success",
    data: { experienceList, pagination },
  });
});

exports.getExperienceDetail = catchAsync(async (request, response, next) => {
  const experienceId = request.params.experienceId;

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

exports.createFakeExperiences = catchAsync(async (request, response, next) => {
  let { number } = request.body;
  if (!number || number > 10) number = 10;
  const tags = [
    "vacation",
    "outdoors",
    "cooking",
    "friday night",
    "drawing",
    "drinking",
  ];

  const tagsObjects = await Tag.generateTags(tags);

  const vacations = [
    "https://a0.muscache.com/im/pictures/9e969efb-0dfa-43b6-baf7-2fe817a6e64d.jpg",
    "https://a0.muscache.com/im/pictures/bc48b254-e2e2-45f5-8798-95700382e7e9.jpg",
    "https://a0.muscache.com/im/pictures/9289ea26-7192-458d-9aa9-415ca53babfe.jpg",
    "https://a0.muscache.com/im/pictures/b52b29da-90b9-4a93-9efc-26df74e7f658.jpg",
    "https://a0.muscache.com/im/pictures/d8a38b41-44e4-42eb-b154-dc0259770a9f.jpg",
  ];

  const outdoors = [
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1722226-media_library/original/309a2c85-b7c4-4520-9893-e1bf4171b6b8.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1722226-media_library/original/166ec7c3-2e04-4b36-bc4f-acfa61fdf791.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1722226-media_library/original/0e0ac553-bc78-42b3-8df9-f14324313613.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1722226-media_library/original/55c7c45f-49a1-4173-ae8f-6f564073a357.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1485488-media_library/original/0b02429d-ff66-43c1-96bf-c37eeaa29685.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1485488-media_library/original/cd41dac9-5925-49d3-9d2a-eb4b6cbf9568.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1736084-media_library/original/0f21c62e-dc6e-4405-94cc-c801f96e231b.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1670543-media_library/original/219d7a74-b5c8-49f9-b313-8f77b5dd2b15.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1670543-media_library/original/1d5f9878-4acb-4124-99a5-cd62c6fcf5de.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1670543-media_library/original/031bec44-2dc3-4c42-90a6-8dd39fe239b5.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1682430-media_library/original/d2639edc-0460-419b-a69f-b4e087557b42.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1682430-media_library/original/fb0d53ac-bda5-4535-b2de-f7c532135f0f.jpeg",
    "https://a0.muscache.com/im/pictures/71c8a858-5071-4d4e-b87a-dcc43fcbd8c4.jpg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1655414-media_library/original/2bd1113e-c412-4850-b361-baecf5ac33d6.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1674495-media_library/original/7cfb6dd6-b0ce-4957-b010-dd52228889ae.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1674495-media_library/original/f083eb6e-3e4b-4554-bd9c-fc055d6acfed.jpeg",
  ];

  const cooking = [
    "https://a0.muscache.com/im/pictures/87d47904-1599-4874-b8fc-0289a27f698d.jpg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1839533-media_library/original/c361c38c-5029-4eb5-8483-0704fc467bfa.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1654806-media_library/original/a7ade5fd-fc85-46c5-ad08-46e690ef0c08.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1654806-media_library/original/aa2cd589-4fc9-4960-a6da-5b3b25dcc5d8.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1654806-media_library/original/207a519b-a8be-4d7d-84c9-a27707f06dc5.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1674019-media_library/original/fa9bcdeb-39ec-40b5-94ba-59877cc45b49.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1674019-media_library/original/b3b42d2d-0b10-495b-93ec-73fce6553e0a.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1674019-media_library/original/ca3c54da-e28d-49a4-8c3b-fd1850c2cc8d.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1718123-media_library/original/0aadffc8-5047-4570-be7c-ec70fce67512.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1718123-media_library/original/32cd0106-951d-4cc8-9399-6502b78a6213.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1718123-media_library/original/8c641e48-f5ff-4a4e-84f3-a54aa830bec9.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1659870-media_library/original/505a5c2a-68a1-4f00-a8a1-6e611863851e.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1659870-media_library/original/f1a0d2c0-0afc-4323-b553-b5ab74a7b34a.jpeg",
    "https://a0.muscache.com/im/pictures/bb84b425-a8a3-4056-a8fc-6ed8e24a0fb5.jpg",
    "https://a0.muscache.com/im/pictures/a2bce010-9885-4859-83e8-276f1630362a.jpg",
    "https://a0.muscache.com/im/pictures/e9c993c4-9de7-46b9-b8ea-f8872f474997.jpg",
  ];

  const fridayNight = [
    "https://a0.muscache.com/im/pictures/66a99dfa-2b49-4e3a-bb19-3a3c9fbca867.jpg",
    "https://a0.muscache.com/im/pictures/297a891f-8e59-4cdd-a3da-60cbfad2ac74.jpg",
    "https://a0.muscache.com/im/pictures/c2fd69e7-35be-4ceb-9b55-8fac6a4e4d48.jpg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1652939-media_library/original/cb9b7455-1c63-4990-a7e4-98013200affe.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1652939-media_library/original/ad1fb68a-e94b-48be-a43b-152a7a440db9.jpeg",
    "https://a0.muscache.com/im/pictures/9ce74372-c1cc-4cdb-8e90-2ae9bd78a8a8.jpg",
    "https://a0.muscache.com/im/pictures/307eddb6-4b4c-40ea-ae22-4d4aabf936ea.jpg",
    "https://a0.muscache.com/im/pictures/2951d2f0-acd7-4dda-9659-6603da1146e0.jpg",
    "https://a0.muscache.com/im/pictures/83317b88-e55a-4d29-9212-ebbf1b5aa956.jpg",
    "https://a0.muscache.com/im/pictures/a0f1bca8-b1be-4069-bcb8-bc45b81cac21.jpg",
  ];

  const drawing = [
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1653933-media_library/original/49c37063-7629-49fa-93c2-ea2229563566.png",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1653933-media_library/original/2dad82c6-5bc6-4c4d-8bb4-1264ecbb5b41.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1653933-media_library/original/92cc0def-6fc9-4fb0-bab1-fc67fec693e8.png",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1653933-media_library/original/f7d90211-a7cf-4d21-a33b-ccd36e366de9.png",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1653933-media_library/original/8d7982e4-3d59-49be-9aa6-d7abe695d2ca.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1655361-media_library/original/f72f6dc2-a600-448d-a7c0-8384631c4576.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1655361-media_library/original/17decbbd-573a-419e-9532-74e81f049558.jpeg",
    "https://a0.muscache.com/im/pictures/b551f2ca-e8ec-4c5f-9784-77c0af70c3a3.jpg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1693507-media_library/original/c80429c9-41e4-47f1-8920-a4af25b61e14.jpeg",
    "https://a0.muscache.com/im/pictures/9319a1b3-c3cc-41c0-92e7-73b8cff6fc04.jpg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1693507-media_library/original/053e2117-67ec-4291-b807-c774802c6118.jpg",
  ];

  const drinking = [
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1747624-media_library/original/c09fb5ab-80f9-4696-88a1-cd217f7ae227.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1747624-media_library/original/8d2b23a4-1deb-495c-86fc-c1900a4e79e1.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1747624-media_library/original/29cc3ec9-dee7-46f2-999f-65738eae622b.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1695361-media_library/original/fc60ed1f-eac8-4f19-8003-5e0cc868b3f4.jpeg",
    "https://a0.muscache.com/im/pictures/d2a28f23-32ca-4b4b-b7a8-1915a87ddb48.jpg",
    "https://a0.muscache.com/im/pictures/df5f5c30-8148-4875-8d91-e907518481ea.jpg",
    "https://a0.muscache.com/im/pictures/aa32b7d2-949d-4a23-9564-b7bc7ea92ff4.jpg",
    "https://a0.muscache.com/im/pictures/d8a791cc-8411-4e6f-a5c8-a8f3b31d6a92.jpg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1671474-media_library/original/6df6ce4b-af5e-48d0-867e-541a75efc52f.jpeg",
    "https://a0.muscache.com/im/pictures/lombard/MtTemplate-1690740-media_library/original/7590ee27-de12-495f-8408-59ce8c81ba9d.jpeg",
    "https://a0.muscache.com/im/pictures/b5559009-5a08-48cc-995d-6d82b7be0522.jpg",
  ];

  const lans = ["vi", "ko", "en"];

  const users = await User.find({ role: "host" });
  for (k = 0; k < number; k++) {
    const randomUserIndex = Math.floor(Math.random() * users.length);
    const user = users[randomUserIndex];

    const randomTagIndex = Math.floor(Math.random() * tags.length);
    let images;
    let tagId;
    const tag = tags[randomTagIndex];
    if (tag == "vacation") {
      images = vacations;
      tagId = tagsObjects[0]._id;
    }
    if (tag == "outdoors") {
      images = outdoors;
      tagId = tagsObjects[1]._id;
    }
    if (tag == "cooking") {
      images = cooking;
      tagId = tagsObjects[2]._id;
    }
    if (tag == "friday night") {
      images = fridayNight;
      tagId = tagsObjects[3]._id;
    }
    if (tag == "drawing") {
      images = drawing;
      tagId = tagsObjects[4]._id;
    }
    if (tag == "drinking") {
      images = drinking;
      tagId = tagsObjects[5]._id;
    }

    let randomImageCount = Math.floor(Math.random() * 5);
    if (randomImageCount == 0) randomImageCount = 2;
    const fakeExperience = new Experience({
      title: faker.lorem.sentence(),
      location: faker.address.state(),
      price: Math.floor(Math.random() * 101),
      duration: Math.floor(Math.random() * 360),
      averageRating: Math.random() * 5,
      description: faker.lorem.paragraph(),
      languages: lans[Math.floor(Math.random() * 3)],
      userId: user._id,
      tags: [tagId],
    });
    let fakeImages = [];
    for (i = 0; i < randomImageCount; i++) {
      const randomImageCount = Math.floor(Math.random() * images.length);
      fakeImages.push({
        url: images[randomImageCount],
        public_id: null,
      });
    }
    fakeExperience.images = fakeImages;
    await fakeExperience.save();
  }

  response.status(200).json({
    status: "success",
    message: `Created ${number} fake experiences`,
  });
});

exports.updateExperience = catchAsync(async (request, response, next) => {
  const {
    title,
    location,
    price,
    duration,
    description,
    tags,
    languages,
    groupSize,
  } = request.body;

  const experience = request.experience;
  if (title) {
    experience.title = title;
  }
  if (location) {
    experience.location = location;
  }
  if (price && parseInt(price) > 0) {
    experience.price = parseInt(price);
  }
  if (duration && parseInt(duration) > 0) {
    experience.duration = parseInt(duration);
  }
  if (description) {
    experience.description = description;
  }
  if (groupSize && parseInt(groupSize) > 0) {
    experience.groupSize = groupSize;
  }
  if (tags) {
    const tagsObj = await Tag.generateTags(tags);
    experience.tags = tagsObj;
  }
  if (languages) {
    experience.languages = languages;
  }

  await experience.save();

  response.status(200).json({
    status: "success",
    data: experience,
  });
});
