require("dotenv").config({ path: ".env" });
var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
const cors = require("cors");
const passport = require("passport");

var indexRouter = require("./src/routes/index");
var userRouter = require("./src/components/user/userRoutes");
var authRouter = require("./src/components/auth/authRoutes");
var errorRouter = require("./src/components/error/errorRoutes");
var experienceRouter = require("./src/components/experience/experienceRoutes");
var { errorHandler } = require("./src/components/error/errorController");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use(passport.initialize());
app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/auth", authRouter);
app.use("/experiences", experienceRouter);
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
