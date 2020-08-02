import { Request, Response, NextFunction } from "express";
import { HttpResponseCode } from "../interfaces";
import { BaseError, ErrorResponse } from "../errors";

const defaultError: ErrorResponse = {
  object: "list",
  statusCode: HttpResponseCode.INTERNAL_SERVER_ERROR,
  errors: [
    {
      object: "error-detail",
      title: "Internal server error",
      detail: "An unknown error occurred.",
    },
  ],
};

function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof BaseError) {
    const errorResponse: ErrorResponse = {
      object: "list",
      statusCode: err.statusCode,
      errors: err.serializeErrors(),
    };

    return res.status(err.statusCode).send(errorResponse);
  }

  if (err instanceof SyntaxError) {
    const errorResponse: ErrorResponse = {
      object: "list",
      statusCode: HttpResponseCode.BAD_REQUEST,
      errors: [
        {
          object: "error-detail",
          title: "Syntax error",
          detail: "Request contained invalid JSON.",
        },
      ],
    };

    return res.status(HttpResponseCode.BAD_REQUEST).send(errorResponse);
  }

  console.error(err);
  return res.status(HttpResponseCode.INTERNAL_SERVER_ERROR).send(defaultError);
}

export { errorHandler };
