const { createExperience } = require('./experienceController')

const router = require('express').Router({mergeParams: true})

router.route("/")
.post(createExperience)








module.exports = router