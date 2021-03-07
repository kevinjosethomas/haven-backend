
export default async function router (fastify) {

  fastify.get(`/${process.env.VERSION}/user/details/:slug`, async (req, res) => {

    const slug = req.params.slug;

    const results = await fastify.pg.query(
      "SELECT ud.username, ud.avatar, ud.publicity, ud.public_flags, ud.created_at, ui.* FROM user_details ud, user_identity ui WHERE ud.id = ui.id AND ud.username = $1",
      [slug]
    )

    if (!results.rowCount) {
      return res.code(404).send({
        success: false,
        message: "Not Found - We couldn't find the specified user"
      });
    }

    const user = results.rows[0];

    if (!user.publicity || user.publicity.toLowerCase() == "private") {
      return res.code(200).send({
        success: true,
        message: "OK - Successfully returned user's public profile details",
        payload: {
          id: user.id,
          username: user.username,
          name: user.name,
          avatar: user.avatar,
          flags: user.flags,
          description: user.description
        }
      });
    }

    if (user.publicity.toLowerCase() == "public") {
      return res.code(200).send({
        success: true,
        message: "OK - Successfully returned user's public profile details",
        payload: user
      })
    }

  })

}
