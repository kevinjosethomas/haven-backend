import plugin from "fastify-plugin";

import cors from "fastify-cors";
import helmet from "fastify-helmet";
import compression from "compression";
import middlewareHandler from "fastify-express";

async function middleware(fastify) {

  // Register middleware
  await fastify.register(middlewareHandler);
  fastify.register(cors);
  fastify.register(helmet);
  fastify.use(compression);

}

export default plugin(middleware)