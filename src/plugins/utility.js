import plugin from "fastify-plugin";

async function utility(fastify) {

  // Function that logs input if debug mode is enabled
  fastify.decorate("debug", (message) => {
    process.env.DEBUG_MODE && app.log.info(message)
  })
  
}

export default plugin(utility)