const express = require("express");
const router = express.Router();

const { createUser } = require("./userController");

router.route("/register").post(createUser);

module.exports = router;
