import { RequestHandler } from 'express';
import { NotAuthorizedError } from '../errors';

export const requireAuthMiddleware: RequestHandler = (req, res, next) => {
  if (!req.currentUser) {
    throw new NotAuthorizedError();
  }

  return next();
};
