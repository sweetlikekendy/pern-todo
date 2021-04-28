import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { resStatusPayload, validateRegistration } from "../../util";
import { usersRoutes } from "../../data/db/controllers/users";
const { createOne, getOneById } = usersRoutes;

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
    try {
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.HASH_SALT));

      if (hashedPassword) {
        try {
          const newUserId = await createOne(firstName, lastName, email, hashedPassword, createdAt);

          if (newUserId.duplicateEmail) {
            return resStatusPayload(res, 202, {
              isCreated: false,
              message: newUserId.message,
            });
          }
          // id is return as an object
          // const stringifyId = JSON.stringify(newUserId);
          // extract just the number from the stringified object
          // const intId = parseInt(stringifyId.replace(/[^0-9\.]/g, ""));

          // const newUser = await getOneById(intId);
          if (newUserId) {
            // delete newUser.password;
            return resStatusPayload(res, 201, {
              isCreated: true,
              message: "Successfully created a user",
            });
          }
        } catch (error) {
          console.error("there was an error creating a new user\n", err);
          return resStatusPayload(res, 500, "Could not create user ");
        }
      }
    } catch (error) {
      console.error("there was an error creating a new user w/ password \n", err);
      return resStatusPayload(res, 500, "Could not create user w/ password");
    }
    //   return await bcrypt
    //     .hash(password, parseInt(process.env.HASH_SALT))
    //     .then((hashedPassword) =>
    //       createOne(firstName, lastName, email, hashedPassword, createdAt)
    //         .then((user) => {
    //           // if a user is created, knex will return an id
    //           if (!isNaN(user)) {
    //             const { id, first_name: firstName, last_name: lastName, email, created_at: createdAt } = user;
    //             console.log(user);
    //             return resStatusPayload(res, 201, {
    //               isCreated: true,
    //               message: "Successfully created a user",
    //               id,
    //               firstName,
    //               lastName,
    //               email,
    //               createdAt,
    //             });
    //           }

    //           // if there is a duplicate
    //           if (user.duplicateEmail) {
    //             return resStatusPayload(res, 202, {
    //               isCreated: false,
    //               message: user.message,
    //             });
    //           }
    //         })
    //         .catch((err) => console.error(err))
    //     )
    //     .catch((err) => console.error(err));
  }
});

export default router;
