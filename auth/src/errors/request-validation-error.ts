import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';
import { CommonErrorResponse } from './@types';

export class RequestValidationError extends CustomError {
  statusCode: number = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request body');

    // Only because we are extending a built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  public serializeErrors(): CommonErrorResponse {
    return {
      errors: this.errors.map((error) => {
        if (error.type === 'field') {
          return { message: error.msg, field: error.path };
        }

        return {
          message: error.msg,
        };
      }),
    };
  }
}
