import { ErrorRequestHandler } from 'express';

import { CustomError, UnknownError } from '../errors';

export const errorHandlerMiddleware: ErrorRequestHandler = (err, _req, res, _next) => {
  let error: CustomError;

  console.log(err);

  if (err instanceof CustomError) {
    error = err;
  } else {
    error = new UnknownError();
  }

  return res.status(error.statusCode).send(error.serializeErrors());
};
