import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { resStatusPayload, validateRegistration } from "../../util";
import { usersRoutes } from "../../data/db/controllers/users";
const { createOne } = usersRoutes;

const router = express.Router();
dotenv.config({ path: `../../../.env` });

// Create a user
router.post("/", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const createdAt = new Date();
  const { error } = validateRegistration(req.body); // validate user registration fields from req.body

  // if there is an error with user registration fields
  if (error) {
    const errorMessage = error.details[0].message;
    resStatusPayload(res, 202, { isCreated: false, message: errorMessage });
  }

  // if there are no errors
  if (!error) {
    return await bcrypt
      .hash(password, parseInt(process.env.HASH_SALT))
      .then((hashedPassword) =>
        createOne(firstName, lastName, email, hashedPassword, createdAt)
          .then((user) => {
            // if a user is created, knex will return an id
            if (!isNaN(user)) {
              return resStatusPayload(res, 201, {
                isCreated: true,
                message: "Successfully created a user",
              });
            }

            // if there is a duplicate
            if (user.duplicateEmail) {
              return resStatusPayload(res, 202, {
                isCreated: false,
                message: user.message,
              });
            }
          })
          .catch((err) => console.error(err))
      )
      .catch((err) => console.error(err));
  }
});

export default router;
