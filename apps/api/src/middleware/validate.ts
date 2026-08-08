import { z } from "zod";
import type {
  Context,
  MiddlewareHandler,
} from "hono";

export type AppVariables = {
  body: unknown;
  query: unknown;
  params: unknown;
};

export type AppEnv = {
  Variables: AppVariables;
};

export function validateBody(
  schema: z.ZodType,
): MiddlewareHandler<AppEnv> {
  return async (
    c: Context<AppEnv>,
    next,
  ) => {
    const body = await c.req.json();

    const result = schema.safeParse(body);

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Request validation failed.",
            details: z.treeifyError(result.error),
          },
        },
        400,
      );
    }

    c.set("body", result.data);

    await next();
  };
}

export function validateQuery(
  schema: z.ZodType,
): MiddlewareHandler<AppEnv> {
  return async (
    c: Context<AppEnv>,
    next,
  ) => {
    const query = c.req.query();

    const result = schema.safeParse(query);

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Query validation failed.",
            details: z.treeifyError(result.error),
          },
        },
        400,
      );
    }

    c.set("query", result.data);

    await next();
  };
}

export function validateParams(
  schema: z.ZodType,
): MiddlewareHandler<AppEnv> {
  return async (
    c: Context<AppEnv>,
    next,
  ) => {
    const params = c.req.param();

    const result = schema.safeParse(params);

    if (!result.success) {
      return c.json(
        {
          success: false,
          error: {
            code: "VALIDATION_ERROR",
            message: "Path parameter validation failed.",
            details: z.treeifyError(result.error),
          },
        },
        400,
      );
    }

    c.set("params", result.data);

    await next();
  };
}