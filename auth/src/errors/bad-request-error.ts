import { CommonErrorResponse } from './@types';
import { CustomError } from './custom-error';

export class BadRequestError extends CustomError {
  statusCode: number = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
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
