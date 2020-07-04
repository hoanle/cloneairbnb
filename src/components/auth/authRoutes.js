const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  loginRequired,
  loginByFacebok,
  facebookAuthHandler,
  loginGoogle,
  googleAuthHandler,
  verifyEmail
} = require("./authController");

router.route("/login").post(login);
router.route("/logout").post(loginRequired, logout);

router.route("/facebook/login").get(loginByFacebok);
router.route("/facebook/authorized").get(facebookAuthHandler);

router.route("/google/login").get(loginGoogle);
router.route("/google/authorized").get(googleAuthHandler);

router.route('/verify').get(verifyEmail);
module.exports = router;
