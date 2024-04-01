import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { RequestValidationError } from '../errors';

export const validateRequestMiddleware: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }

  return next();
};
