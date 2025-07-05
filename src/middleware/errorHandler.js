import logger from '../config/logger.js';

const errorHandler = (err, req, res, next) => {
  logger.error(err.message, err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Server Error';

  res.status(statusCode).json({
    message: message,
    // In development, you might want to send the stack trace
    // stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export default errorHandler;