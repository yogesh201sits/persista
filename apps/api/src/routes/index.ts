import { Hono } from "hono";
import health from "./health";
import memories from "./memories";
import memoriesSearch from "./memories-search";
import graphSearch from "./graph-search";
import hybridSearch from "./combine-results";

const routes = new Hono();

routes.route("/health", health);

routes.route("/memories", memories);

routes.route("/memories/search", memoriesSearch);

routes.route("/memories/graph/search", graphSearch);

routes.route("/memories/search/hybrid",hybridSearch);

export default routes;
