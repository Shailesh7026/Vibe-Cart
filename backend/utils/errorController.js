import CustomError from "./CustomError.js";

// Express error-handling middleware
export default (err, req, res, next) => {
  err = err || new Error("Unknown error");

  console.error(err);

  // Error handling for different error types 

  // Mongoose validation errors
  if (err.name === "ValidationError" && err.errors) {
    const errors = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      status: "fail",
      message: "Validation failed",
      errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000 && err.keyValue) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    return res.status(400).json({
      success: false,
      status: "fail",
      message: `${field} "${value}" already exists`,
      field,
      value,
    });
  }

  // Mongoose cast error (invalid id/type)
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      status: "fail",
      message: `Invalid ${err.path}: ${err.value}`,
    });
  }

  if (err instanceof CustomError) {
    const statusCode = err.statusCode || 400;
    return res.status(statusCode).json({
      success: false,
      status: err.status || (statusCode >= 500 ? "error" : "fail"),
      message: err.message,
    });
  }

  const statusCode = err.statusCode || 500;
  const status = err.status || (statusCode >= 500 ? "error" : "fail");

  return res.status(statusCode).json({
    success: false,
    status,
    message: err.message || "Internal Server Error",
  });
};