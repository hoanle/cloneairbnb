const { catchAsync } = require("./../error/errorController");
const AppError = require("./../error/appError");
const User = require("./../user/userModel");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

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

  user.tokens = user.tokens.filter(x => x !== token);
  await user.save()
  response.status(200).json({
      status: 'success',
      data: null
  })
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
