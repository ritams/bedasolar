import logger from '../services/logger.js';

export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export const handleError = (res, error, context = '', statusCode = 500) => {
  logger.error(`${context} error:`, { error: error.message, stack: error.stack });
  res.status(statusCode).json({ error: error.message });
}; 