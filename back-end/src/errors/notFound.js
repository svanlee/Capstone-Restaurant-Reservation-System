/**
 * Express API "Not found" handler with error handling.
 */
function notFound(req, res, next) {
  const error = new Error(`Path not found: ${req.originalUrl}`);
  error.status = 404;
  next(error);
}

// Error handling middleware
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.status || 500);
  res.json({
    message: err.message,
    status: err.status || 500,
    stack: err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
