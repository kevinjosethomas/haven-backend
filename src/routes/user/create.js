import bcrypt from "bcrypt";
import crypto from "crypto";
import validator from "email-validator";

function hashPassword(password) {

  return new Promise((resolve, reject) => {

    bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        fastify.debug(err);
        reject(err);
        throw err;
      }
      return resolve(hash);
    })

  })

}

export default async function router (fastify) {

  fastify.post(`/${process.env.VERSION}/user/create`, async (req, res) => {

    const body = req.body;
    const email = body.email;
    const username = body.username;
    const password = body.password;
    
    // Check if input is valid (length limits)
    if (!email || !validator.validate(email)) {
      return res.code(400).send({
        success: false,
        message: "Bad Request - Invalid email provided"
      });
    }

    if (!username || username.length < 3 || username.length > 32) {
      return res.code(400).send({
        success: false,
        message: "Bad Request - Invalid username provided"
      });
    }

    if (!password || password.length < 4 || password.length > 32) {
      return res.code(400).send({
        success: false,
        message: "Bad Request - Invalid password provided"
      });
    }

    const existingUsers = await fastify.pg.query(
      "SELECT * FROM user_details WHERE LOWER(email) = LOWER($1) OR LOWER(username) = LOWER($2)",
      [email, username]
    )

    if (existingUsers.rowCount) {

      for (const row of existingUsers.rows) {
        if (row.email == email) {
          return res.code(409).send({
            success: false,
            message: "Conflict - This email has already been used"
          })
        }
        if (row.username == username) {
          return res.code(409).send({
            success: false,
            message: "Conflict - This username has already been used"
          })
        }
      }

    }

    // Hash the provided password to store it in the database
    const hashedPassword = await hashPassword(password);

    const id = (await fastify.pg.query(
      "INSERT INTO user_details (email, username, email_verified, public, flags, updated_at, created_at) VALUES ($1, $2, false, false, 0, NOW(), NOW()) RETURNING id",
      [email, username]
    )).rows[0].id;

    const hmac = crypto.createHmac("sha256", process.env.HASH_KEY_1);
    const hashed_ip = hmac.update(req.ip).digest("hex");

    await fastify.pg.query(
      "INSERT INTO user_login (id, email, username, password, last_login, login_ip) VALUES ($1, $2, $3, $4, NOW(), $5)",
      [id, email, username, hashedPassword, hashed_ip]
    )

    await fastify.pg.query(
      "INSERT INTO user_identity (id) VALUES ($1)",
      [id]
    )

    return res.code(200).send({
      success: true,
      message: "OK - Successfully created the user account"
    })

  })

};
