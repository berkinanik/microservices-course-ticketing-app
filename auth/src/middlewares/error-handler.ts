import { ErrorRequestHandler } from 'express';

import { CustomError, UnknownError } from '../errors';

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  let error: CustomError;

  if (err instanceof CustomError) {
    error = err;
  } else {
    error = new UnknownError();
  }

  return res.status(error.statusCode).send(error.serializeErrors());
};
