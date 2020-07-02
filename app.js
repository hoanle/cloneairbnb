require("dotenv").config({ path: ".env" });
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
const cors = require('cors')

var indexRouter = require("./src/routes/index");
var userRouter = require("./src/components/user/userRoutes");
var errorRouter = require("./src/components/error/errorRoutes");
var { errorHandler } = require("./src/components/error/errorController");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use(errorRouter);
app.use(errorHandler);

mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to database"));

module.exports = app;
