import bcrypt from "bcrypt";
import crypto from "crypto";

export default async function router (fastify) {

  fastify.post("/v1/user/create", async (req, res) => {

    const body = req.body;
    const email = body.email;
    const vanity = body.vanity;
    const username = body.username;
    const password = body.password;
    
    // Check if input is valid (length limits)
    if (!email || email.length < 3 || email.length > 320) {
      return res.code(400).send({
        success: false,
        message: "Bad Request - Invalid email provided"
      });
    }

    if (!vanity || vanity.length < 3 || vanity.length > 32) {
      return res.code(400).send({
        success: false,
        message: "Bad Request - Invalid vanity provided"
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

    let existingUsers = await fastify.pg.query(
      "SELECT * FROM user_details WHERE LOWER(email) = LOWER($1) OR LOWER(vanity) = LOWER($2) OR LOWER(username) = LOWER($3)",
      [email, vanity, username]
    )

    if (existingUsers.rowCount) {

      for (const row of rows) {
        if (row.email == email) {
          return res.code(409).send({
            success: false,
            message: "Conflict - This email has already been used"
          })
        }
        if (row.vanity == vanity) {
          return res.code(409).send({
            success: false,
            message: "Conflict - This vanity has already been taken"
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
    let hashedPassword;
    await bcrypt.hash(password, 10, (err, hash) => {
      if (err) {
        fastify.debug(err);
        throw err;
      }
      hashedPassword = hash;
    })

    const id = (await fastify.pg.query(
      "INSERT INTO user_details (email, vanity, username, email_verified, updated_at, created_at) VALUES ($1, $2, $3, false, NOW(), NOW()) RETURNING *",
      [email, vanity, username]
    )).rows[0].id;

    const cipher = crypto.createCipheriv("aes-256-cbc")

    await fastify.pg.query(
      "INSERT INTO user_login (id, email, username, password, last_login, login_ip) VALUES ($1, $2, $3, $4, NOW(), $5)",
      [id, email, username, password, ]
    )
    

    return res.code(200).send({
      success: true,
      message: "OK - Successfully created the user account"
    })

    

    // TODO
    // Hash password
    // Insert into db

  })

};
