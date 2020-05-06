import express from "express";
import { resError } from "../resError";
import { usersRoutes } from "../../data/db/resources/users";

const { createOne } = usersRoutes;

const router = express.Router();

// Create a user
router.post("/", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const createdAt = new Date();

  if (firstName && lastName && email && password && createdAt) {
    return createOne(firstName, lastName, email, password, createdAt)
      .then((user) => {
        if (user.command === "INSERT") {
          return res.json({
            message: "Successfully created a user",
          });
        }
        if (user.duplicateEmail) {
          return res.json({
            message: "An account already exists with your email",
          });
        }
      })
      .catch((err) => console.error(err));
  }
  return resError(
    res,
    500,
    "Please make sure you have filled out the form completely"
  );
});

export default router;
