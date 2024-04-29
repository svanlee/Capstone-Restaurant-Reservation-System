// I have implemented an async error boundary to set a limit on unresponsive requests with individual error codes

const { REJECTED_REQUEST_DEFAULT_STATUS } = process.env;

function asyncErrorBoundary(delegate, defaultStatus = REJECTED_REQUEST_DEFAULT_STATUS) {
  return async (req, res, next) => {
    try {
      await delegate(req, res, next);
    } catch (error) {
      const { status = defaultStatus, message = error.message } = error;

      // Check if the error status is a valid HTTP status code
      if (status !== undefined && !(status >= 100 && status <= 599)) {
        return next(new Error(`Invalid status code: ${status}`));
      }

      // Check if the error message is a string
      if (typeof message !== 'string') {
        return next(new Error('Error message must be a string'));
      }

      next({ status, message });
    }
  };
}

module.exports = asyncErrorBoundary;
