import app from "./app";
import { env } from "./config/env";
import { logger } from "./middleware/logger";

logger.info("Starting Persista API");

export default {
  port: env.PORT || 3000,
  fetch: app.fetch,
};
