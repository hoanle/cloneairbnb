const Experience = require("./experienceModel");
const { catchAsync } = require("./../error/errorController");
const AppError = require("./../error/appError");

exports.isMyExperience = catchAsync(async (request, response, next) => {
  const experienceId = request.params.experienceId;
  if (!experienceId) {
    return next(
      new AppError(404, `Can not find experience with id ${experienceId}`)
    );
  }
  const experience = await Experience.findOne({
    userId: request.user._id,
    _id: experienceId,
  });
  if (!experience) {
    return next(
      new AppError(401, `Unauthorized to update experience id ${experienceId}`)
    );
  }
  request.experience = experience;
  next();
});
