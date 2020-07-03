const express = require("express");
const router = express.Router();

const { createUser, fakeUsers, getUserList } = require("./userController");

router.route('/').get(getUserList);
router.route("/register").post(createUser);
router.route('/fakeUsers').post(fakeUsers);

module.exports = router;
