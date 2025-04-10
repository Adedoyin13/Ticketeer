const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err); // headers already sent, just pass it on
  }

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

module.exports = errorHandler;