import { BaseError } from './base-error';
import { HttpResponse } from '../util/http-response';
import { ValidationError } from 'express-validator';

class RequestValidationError extends BaseError {
  statusCode = HttpResponse.BAD_REQUEST;

  constructor(private errors: ValidationError[]) {
    super('Request validation error');
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map(error => {
      return {
        title: 'Request validation error',
        detail: error.msg
      }
    });
  }
}

export { RequestValidationError };