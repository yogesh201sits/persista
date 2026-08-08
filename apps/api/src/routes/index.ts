import { Hono } from "hono";
import health from "./health";
import memories from "./memories";

const routes = new Hono();

routes.route("/health", health);

routes.route("/memories", memories);

export default routes;
