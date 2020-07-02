const { catchAsync } = require("./../error/errorController");
const AppError = require("./../error/appError");
const User = require("./userModel");

exports.createUser = catchAsync(async (request, response, next) => {
  const { name, email, password } = request.body;
  if (!name || !email || !password) {
    return next(new AppError(400, "Param is missing"));
  }

  const user = await User.findOrCreateOne(request.body);
  const token = await user.generateToken();
  response.status(200).json({
    status: "success",
    data: { user, token },
  });
});