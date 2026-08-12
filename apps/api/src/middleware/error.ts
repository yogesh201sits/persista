import type { Context } from "hono";

import { AppError } from "../errors/app-error";

import { logger } from "./logger";

export const errorMiddleware = (err: Error, c: Context) => {
  if (err instanceof AppError) {
    return c.json(
      {
        success: false,

        error: {
          code: err.statusCode,
          message: err.message,
        },
      },
      err.statusCode,
    );
  }

  logger.error(
    {
      error: err,
      requestId: c.get("requestId"),
    },
    "Unhandled request error",
  );

  return c.json(
    {
      success: false,

      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "An unexpected error occurred.",
      },
    },
    500,
  );
};
