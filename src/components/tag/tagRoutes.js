const express = require("express");
const router = express.Router();

const { getTagList } = require("./tagController");

router.route("/").get(getTagList);

module.exports = router;
