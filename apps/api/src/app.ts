import { Hono } from "hono";
import { cors } from "hono/cors";
import routes from "./routes";
import { errorMiddleware } from "./middleware";
import { requestIdMiddleware } from "./middleware/request-id";

const app = new Hono();

app.onError(errorMiddleware);

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "X-Request-ID"],
  }),
);

app.use("*", requestIdMiddleware);

app.route("/", routes);

export default app;
