import { CommonErrorResponse } from './@types';
import { CustomError } from './custom-error';

export class UnknownError extends CustomError {
  constructor(public message: string = 'Something went wrong', public statusCode = 500) {
    super(message);

    // Extending a built-in class
    Object.setPrototypeOf(this, UnknownError.prototype);
  }

  public serializeErrors(): CommonErrorResponse {
    return {
      errors: [
        {
          message: this.message,
        },
      ],
    };
  }
}
