/**
 * Global error handling middleware.
 * Catches all errors thrown via next(err) or from express-async-handler.
 * Returns a consistent JSON error response shape across the entire API.
 */
export const errorHandler = (err, req, res, next) => {
  // Sometimes an error is thrown after a 200 status is already set — fix that
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    success: false,
    message: err.message,
    // Show stack trace only in development mode
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};