const { catchAsync } = require("./../error/errorController");
const AppError = require("./../error/appError");
const User = require("./../user/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const passport = require("./../../passport/index");

exports.login = catchAsync(async (request, response, next) => {
  const { email, password } = request.body;

  if (!email || !password) {
    return next(new AppError(400, "Email or password is missing"));
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return next(new AppError(400, `Can not find user with email ${email}`));
  }
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return next(new AppError(400, "Password is incorrect"));
  }

  const token = await user.generateToken();
  response.status(200).json({
    status: "success",
    data: { user, token },
  });
});

exports.logout = catchAsync(async (request, response, next) => {
  const token = request.token;
  const user = request.user;

  user.tokens = user.tokens.filter((x) => x !== token);
  await user.save();
  response.status(200).json({
    status: "success",
    data: null,
  });
});

exports.loginRequired = catchAsync(async (request, response, next) => {
  const authorization = request.headers.authorization;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AppError(401, "Unauthorized"));
  }
  const token = authorization.replace("Bearer ", "");
  const decode = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({ _id: decode._id, tokens: token });
  if (!user) return next(new AppError(401, "Invalid token"));
  request.user = user;
  request.token = token;
  next();
});

exports.loginByFacebok = passport.authenticate("facebook", {
  scope: ["email", 'public_profile'],
});
exports.facebookAuthHandler = async (request, response, next) => {
  passport.authenticate("facebook", async (error, profile) => {
    if (error) {
      return response.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
    const { email, last_name, first_name, picture } = profile._json;
    const user = await User.findOrCreateOne({
      email: email,
      name: `${first_name} ${last_name}`,
      verified: true,
      avatar: {
        url: picture.data.url, 
        public_id: null
      }
    });
    const token = await user.generateToken();
    response.status(200).json({
      status: "success",
      data: { user, token },
    });
  })(request, response, next);
};

exports.loginGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleAuthHandler = (request, response, next) => {
  passport.authenticate("google", async (err, profile) => {
    if (err) {
      return response.status(400).json({
        status: "fail",
        message: err.message,
      });
    }
    const { email, name, picture } = profile._json;
    const user = await User.findOrCreateOne({
      email: email,
      name: name,
      verified: true,
      avatar: {
        url: picture, 
        public_id: null
      }
    });
    const token = await user.generateToken();
    response.status(200).json({
      status: "success",
      data: { user, token },
    });
  })(request, response, next);
};

exports.verifyEmail = catchAsync(async (request, response, next) => {
  const { verificationToken } = request.query;
  console.log(verificationToken);
  if (!verificationToken) {
    return next(new AppError(401, "Unauthorized. Token is empty"));
  }
  const decode = jwt.verify(verificationToken, process.env.JWT_SECRET);
  const user = await User.findOne({
    _id: decode._id,
    verificationToken: verificationToken,
  });
  if (!user) {
    return next(new AppError(401, "Unauthorized. Token is invalid"));
  }
  user.verified = true;
  user.verificationToken = "";
  await user.save();
  response.status(200).json({
    status: "success",
    message: "User is verified",
  });
});

exports.shouldBeHost = catchAsync(async (request, response, next) => {
  const user = request.user;
  if (user.role !== "host") {
    return response.status(401).json({
      status: "fail",
      message: "Unauthorized. You are not a host.",
    });
  }
  next();
});
