import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

import { resError } from "../resError";
import { validateLogin } from "../validation";
import { usersRoutes } from "../../data/db/resources/users";

const { getOneByEmail } = usersRoutes;

const router = express.Router();
dotenv.config({ path: `../../../.env` });

// Create a user
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateLogin(req.body); // validate user login credentials from req.body

  // if there is an error with user login credentials
  if (error) {
    const errorMessage = error.details[0].message;
    return resError(res, 500, errorMessage);
  }

  // if there are no errors
  if (!error) {
    const user = await getOneByEmail(email);

    // if user does not exist in db
    if (!user) {
      return res.json({ message: `No account with ${email} found` });
    }

    // if user does exist in db
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) return res.json({ message: `Invalid password` });
      if (validPassword) return res.json({ message: `Logging in` });
    }
  }
});

export default router;
