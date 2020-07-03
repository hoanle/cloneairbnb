const { createExperience, getExperiences } = require("./experienceController");
const { loginRequired } = require("../auth/authController");

const router = require("express").Router({ mergeParams: true });

router.route("/").post(loginRequired, createExperience).get(getExperiences);

module.exports = router;
