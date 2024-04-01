import { CommonErrorResponse } from './@types';
import { CustomError } from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode: number = 401;

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): CommonErrorResponse {
    return {
      errors: [
        {
          message: this.message,
        },
      ],
    };
  }
}
