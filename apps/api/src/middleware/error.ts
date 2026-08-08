import type { Context } from "hono";
import { AppError } from "../errors/app-error";

export const errorMiddleware = (
  err: Error,
  c: Context,
) => {
  if (err instanceof AppError) {
    return c.json(
      {
        error: err.message,
      },
      err.statusCode,
    );
  }

  console.error(err);

  return c.json(
    {
      error: "Internal server error",
    },
    500,
  );
};