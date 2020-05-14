import express from "express";
import bcrypt from "bcrypt";

import { resStatusPayload, validateLogin, issueJwt } from "../../util";
import { usersRoutes } from "../../data/db/controllers/users";

const { getOneByEmail } = usersRoutes;

const router = express.Router();

// Create a user
router.post("/", async (req, res) => {
  const { email, password } = req.body;
  const { error } = validateLogin(req.body); // validate user login credentials from req.body

  // if there is an error with user login credentials
  if (error) {
    const errorMessage = error.details[0].message;
    return resStatusPayload(res, 500, errorMessage);
  }

  // if there are no errors
  if (!error) {
    const user = await getOneByEmail(email);

    // if user does not exist in db
    if (!user) {
      return resStatusPayload(res, `401`, {
        loggedIn: false,
        message: `No account with ${email} found`,
      });
    }

    // if user does exist in db
    if (user) {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword)
        return res.json({
          loggedIn: false,
          message: `Invalid password`,
        });

      if (validPassword) {
        const tokenObject = issueJwt(user);
        return resStatusPayload(res, "200", {
          loggedIn: true,
          user,
          token: tokenObject.token,
          message: "Logging In",
        });
      }
    }
  }
});

export default router;
