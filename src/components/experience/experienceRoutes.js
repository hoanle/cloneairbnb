const { createExperience, getExperiences, uploadExpImages } = require("./experienceController");
const { loginRequired } = require("../auth/authController");
const multer = require('multer')

const router = require("express").Router({ mergeParams: true });
const upload = require('../../services/multer')
const multerUpload = upload.array('image')

router.route("/")
.post(loginRequired, createExperience)
.get(getExperiences);

router.post("/images-upload",multerUpload, uploadExpImages)

module.exports = router;
