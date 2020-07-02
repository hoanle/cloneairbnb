const AppError = require("./appError");

exports.handleNotFound = (request, response, next) => {
  next(new AppError(404, "URL not found"));
};

exports.errorHandler = (error, request, response, next) => {
  error.status = error.status || "error";
  error.code = error.code || 500;
  response.status(error.code).json({
    code: error.code,
    status: error.status,
    message: error.message,
  });
};

exports.catchAsync = (func) => {
  return (request, response, next) => func(request, response, next).catch(next);
};