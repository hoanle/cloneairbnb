const express = require("express");
const router = express.Router();
const { login, logout, loginRequired } = require('./authController')

router.route('/login').post(login);
router.route('/logout').post(loginRequired, logout);

module.exports = router;