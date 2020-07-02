class AppError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
    this.status = `${code}`.startsWith("4") ? "fail" : "error";
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
