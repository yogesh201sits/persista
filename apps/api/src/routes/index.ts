import { Hono } from "hono";
import health from "./health";
import memories from "./memories";
import memoriesSearch from "./memories-search";
import graphSearch from "./graph-search";

const routes = new Hono();

routes.route("/health", health);

routes.route("/memories", memories);

routes.route("/memories/search",memoriesSearch);

routes.route("/memories/graph/search",graphSearch)

export default routes;
