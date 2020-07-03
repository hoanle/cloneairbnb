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
} = require("./authController");

router.route("/login").post(login);
router.route("/logout").post(loginRequired, logout);

router.route("/facebook/login").get(loginByFacebok);
router.route("/facebook/authorized").get(facebookAuthHandler);

router.route("/google/login").get(loginGoogle);
router.route("/google/authorized").get(googleAuthHandler);

module.exports = router;
