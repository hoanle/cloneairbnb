const {
  createExperience,
  getExperiences,
  uploadExpImages,
} = require("./experienceController");
const { loginRequired, shouldBeHost } = require("../auth/authController");

const router = require("express").Router({ mergeParams: true });
const upload = require("../../services/multer");
const multerUpload = upload.array("images");

router
  .route("/")
  .post(loginRequired, shouldBeHost, multerUpload, createExperience)
  .get(getExperiences);

router.post("/images-upload", multerUpload, uploadExpImages);

module.exports = router;
