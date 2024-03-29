import { CommonErrorResponse } from './@types';
import { CustomError } from './custom-error';

export class NotFoundError extends CustomError {
  statusCode: number = 404;

  constructor() {
    super('Route not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): CommonErrorResponse {
    return {
      errors: [
        {
          message: 'Not found',
        },
      ],
    };
  }
}
