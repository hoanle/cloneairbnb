const express = require("express");
const router = express.Router();
const { handleNotFound } = require("./errorController");

router.route("*").all(handleNotFound);

module.exports = router;
