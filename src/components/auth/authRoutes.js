const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  loginRequired,
  loginByFacebok,
  facebookAuthHandler,
} = require("./authController");

router.route("/login").post(login);
router.route("/logout").post(loginRequired, logout);
router.route("/facebook/login").get(loginByFacebok);
router.route("/facebook/authorized").get(facebookAuthHandler);

module.exports = router;
