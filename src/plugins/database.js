import plugin from "fastify-plugin";
import postgres from "fastify-postgres";

async function database(fastify) {

  // Register database middleware
  fastify.register(postgres, {
    connectionString: process.env.DATABASE_CONNSTRING
  })

}

export default plugin(database)
