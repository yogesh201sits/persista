import type { ZodSchema } from "zod";
import type { Context, MiddlewareHandler } from "hono";

export function validateBody<T>(schema: ZodSchema<T>): MiddlewareHandler {
  return async (c: Context, next) => {
    const body = await c.req.json();
    const result = schema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed.",
            details: result.error.flatten(),
          },
        },
        400,
      );
    }

    c.set("body", result.data);

    await next();
  };
}

export function validateQuery<T>(schema: ZodSchema<T>): MiddlewareHandler {
  return async (c: Context, next) => {
    const query = c.req.query();
    const result = schema.safeParse(query);

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Query validation failed.",
            details: result.error.flatten(),
          },
        },
        400,
      );
    }

    c.set("query", result.data);

    await next();
  };
}

export function validateParams<T>(schema: ZodSchema<T>): MiddlewareHandler {
  return async (c: Context, next) => {
    const params = c.req.param();
    const result = schema.safeParse(params);

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Path parameter validation failed.",
            details: result.error.flatten(),
          },
        },
        400,
      );
    }

    c.set("params", result.data);

    await next();
  };
}
