import { CommonErrorResponse } from './@types';
import { CustomError } from './custom-error';

export class DatabaseConnectionError extends CustomError {
  statusCode = 500;

  constructor() {
    super('Error connecting to database');

    // Extending a built-in class
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
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
