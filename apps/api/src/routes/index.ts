import { Hono } from "hono";
import health from "./health";
import memories from "./memories";
import memoriesSearch from "./memories-search";

const routes = new Hono();

routes.route("/health", health);

routes.route("/memories", memories);

routes.route("/memories/search",memoriesSearch);

export default routes;
