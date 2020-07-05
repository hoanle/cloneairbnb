const express = require("express");
const router = express.Router();
const upload = require("../../services/multer");
const multerUpload = upload.array("images");

const { createUser, fakeUsers, getUserList } = require("./userController");

router.route("/").get(getUserList);
router.route("/register").post(multerUpload, createUser);
router.route("/fakeUsers").post(fakeUsers);

module.exports = router;
