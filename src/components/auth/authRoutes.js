const express = require("express");
const router = express.Router();
const { login } = require('./authController')

router.route('/login').post(login)

module.exports = router;