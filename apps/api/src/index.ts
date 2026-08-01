import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Persista API");
});

export default {
  port: Number(3000),
  fetch: app.fetch,
};