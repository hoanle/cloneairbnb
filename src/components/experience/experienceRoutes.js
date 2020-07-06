const {
  createExperience,
  getExperiences,
  uploadExpImages,
  searchExperiences,
  getExperienceDetail,
  createFakeExperiences,
  updateExperience,
} = require("./experienceController");
const { loginRequired, shouldBeHost } = require("../auth/authController");
const { isMyExperience } = require("./../experience/experienceHelper");
const router = require("express").Router({ mergeParams: true });
const upload = require("../../services/multer");
const multerUpload = upload.array("images");

router
  .route("/")
  .post(loginRequired, shouldBeHost, multerUpload, createExperience)
  .get(getExperiences);

router.route("/search").get(searchExperiences);
router.route("/fakeExperiences").post(createFakeExperiences);

router
  .route("/:experienceId")
  .get(getExperienceDetail)
  .put(loginRequired, shouldBeHost, isMyExperience, updateExperience);

router.post("/images-upload", multerUpload, uploadExpImages);

module.exports = router;
