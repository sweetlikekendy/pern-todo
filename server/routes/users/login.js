import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { resError } from "../resError";
import { usersRoutes } from "../../data/db/resources/users";

const { createOne } = usersRoutes;

const router = express.Router();
dotenv.config({ path: `../../../.env` });

// Create a user
router.post("/", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const createdAt = new Date();

  if (validateUser(req.body)) {
    return bcrypt
      .hash(password, parseInt(process.env.HASH_SALT))
      .then((hashedPassword) =>
        createOne(firstName, lastName, email, hashedPassword, createdAt)
          .then((user) => {
            console.log(user);
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
  }
  return resError(
    res,
    500,
    "Please make sure you have filled out the form completely with a valid email with a password with at least 6 characters"
  );
});

// validate user from req.body
const validateUser = (user) => {
  const emailReg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  const validFirstName =
    typeof user.firstName == "string" && user.firstName.trim() != "";
  const validLastName =
    typeof user.lastName == "string" && user.lastName.trim() != "";
  const validEmail =
    typeof user.email == "string" &&
    user.email.trim() != "" &&
    emailReg.test(user.email);
  const validPassword =
    typeof user.password == "string" &&
    user.password.trim() != "" &&
    user.password.length >= 6;

  return validFirstName && validLastName && validEmail && validPassword;
};

export default router;
