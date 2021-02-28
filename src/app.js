import Pool from "pg-pool";
import dotenv from "dotenv";
import fastify from "fastify";

import cors from "fastify-cors";
import helmet from "fastify-helmet";
import compression from "compression";
import middleware from "fastify-express"

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

// Create a PostgreSQL pool connection
const pool = new Pool({
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  host: process.env.DATABASE_HOST,
  password: process.env.DATABASE_PASS,
  port: process.env.DATABASE_PORT,
  idleTimeoutMillis: 1000,
  _connectionTimeoutMillis: 1000
});

// Asynchronous tasks
let database;
(async () => {

  // Register middleware
  await app.register(middleware);
  app.register(cors);
  app.register(helmet);
  app.use(compression);

  // Connect to the database pool
  database = await pool.connect();

  // Run the webserver
  await app.listen(process.env.PORT)
  app.log.info(`Server Started on PORT ${process.env.PORT}`)

})();

export { app, database, debug }