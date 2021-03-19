
export default async function router (fastify) {

  fastify.delete(`/${process.env.VERSION}/user/delete/:username`, async (req, res) => {

    const username = req.params.username;

    const results = await fastify.pg.query(
      "SELECT * FROM user_details WHERE username = $1",
      [username]
    );

    if (!results.rowCount) {
      return res.code(404).send({
        success: false,
        message: "Not Found - We couldn't find the specified user"
      });
    }

    await fastify.pg.query(
      "DELETE FROM user_details WHERE username = $1",
      [username]
    );

    return res.code(200).send({
      success: true,
      message: "OK - Successfully deleted provided user account"
    });

  })

}
