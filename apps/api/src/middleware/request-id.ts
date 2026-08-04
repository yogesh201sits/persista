import type { MiddlewareHandler } from "hono";
import { randomUUID } from "node:crypto";

export const requestIdMiddleware: MiddlewareHandler = async (c, next) => {
  const requestId =
    c.req.header("X-Request-Id") ??
    c.req.header("x-request-id") ??
    randomUUID();

  c.set("requestId", requestId);

  await next();

  c.header("X-Request-Id", requestId);
};

export interface ApiVariables {
  requestId: string;
  body: unknown;
  query: unknown;
  params: unknown;
}
