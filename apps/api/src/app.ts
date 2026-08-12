import { Hono } from "hono";
import routes from "./routes";
import { errorMiddleware } from "./middleware";
import { requestIdMiddleware } from "./middleware/request-id";

const app = new Hono();

app.onError(errorMiddleware);

app.use("*", requestIdMiddleware);

app.route("/", routes);

export default app;
