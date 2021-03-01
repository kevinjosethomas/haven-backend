import dotenv from "dotenv";
import fastify from "fastify";

import database from "./plugins/database.js";
import middleware from "./plugins/middleware.js";

// Loading environment variables
dotenv.config();
process.env.DEBUG_MODE = process.env.DEBUG_MODE === "true"
process.env.PRODUCTION = process.env.PRODUCTION === "true"

// Fastify webserver instance
const app = fastify({
  logger: true
});

// Function that logs input if debug mode is enabled
const debug = (message) => {
  process.env.DEBUG_MODE && app.log.info(message)
}

// Asynchronous tasks
(async () => {

  // Initialize plugins
  app.register(database);
  app.register(middleware);

  // Run the webserver
  await app.listen(process.env.PORT);

})();

export { app, debug }