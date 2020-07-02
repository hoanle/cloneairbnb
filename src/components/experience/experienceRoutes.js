const { createExperience, getExperience } = require('./experienceController')
const { loginRequired } = require('../auth/authController')

const router = require('express').Router({mergeParams: true})

router.route("/")
.post(loginRequired,createExperience)
.get(getExperience)








module.exports = router