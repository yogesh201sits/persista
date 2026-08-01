import { Hono } from "hono";
import health from "./health";

const routes = new Hono();

routes.route("/health", health);

export default routes;