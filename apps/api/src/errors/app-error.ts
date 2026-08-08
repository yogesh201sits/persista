import type { ContentfulStatusCode } from "hono/utils/http-status";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: ContentfulStatusCode,
  ) {
    super(message);

    this.name = "AppError";
  }
}