import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { resError } from "../resError";
import { validateRegistration } from "../validation";
import { usersRoutes } from "../../data/db/resources/users";
const { createOne } = usersRoutes;

const router = express.Router();
dotenv.config({ path: `../../../.env` });

// Create a user
router.post("/", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const createdAt = new Date();
  const { error } = validateRegistration(req.body); // validate user registration fields from req.body

  // if there are no errors
  if (!error) {
    return bcrypt
      .hash(password, parseInt(process.env.HASH_SALT))
      .then((hashedPassword) =>
        createOne(firstName, lastName, email, hashedPassword, createdAt)
          .then((user) => {
            // if a user is created, knex will return an id
            if (!isNaN(user)) {
              return res.json({
                message: "Successfully created a user",
              });
            }

            // if there is a duplicate
            if (user.duplicateEmail) {
              return res.json({
                message: user.message,
              });
            }
          })
          .catch((err) => console.error(err))
      )
      .catch((err) => console.error(err));
  } else {
    const errorMessage = error.details[0].message;
    return resError(res, 500, errorMessage);
  }
});

export default router;
