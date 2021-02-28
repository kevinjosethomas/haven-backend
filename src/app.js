import fastify from "fastify";

const app = fastify({
  logger: true
});

(async () => {
  await app.listen(3000)
})();