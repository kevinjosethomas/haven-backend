import plugin from "fastify-plugin";

import cors from "fastify-cors";
import helmet from "fastify-helmet";
import compress from "fastify-compress";
import middlewareHandler from "fastify-express";

async function middleware(fastify) {

  // Register middleware
  await fastify.register(middlewareHandler);
  fastify.register(cors);
  fastify.register(helmet);
  fastify.register(compress);

}

export default plugin(middleware)