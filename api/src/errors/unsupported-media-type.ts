import { BaseError, SerializedError } from "./base-error";
import { HttpResponseCode } from "../interfaces";

class UnsupportedMediaTypeError extends BaseError {
  statusCode = HttpResponseCode.UNSUPPORTED_MEDIA_TYPE;

  error: SerializedError = {
    object: "error-detail",
    title: "Unsupported media type",
    detail: "Requests must contain a Content-Type header of application/json.",
  };

  constructor(message = "Requests must contain a Content-Type header of application/json.") {
    super(message);
    Object.setPrototypeOf(this, UnsupportedMediaTypeError.prototype);
    this.error.detail = this.message;
  }

  serializeErrors() {
    return [this.error];
  }
}

export { UnsupportedMediaTypeError };
