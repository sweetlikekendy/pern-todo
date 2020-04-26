import express from "express";
import { resError } from "../resError";
import { usersRoutes } from "../../data/db/util/users";

const { createOne } = usersRoutes;

const router = express.Router();

// Create a user
router.post("/", (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  const createdAt = new Date();

  if (firstName && lastName && email && password && createdAt) {
    return createOne(firstName, lastName, email, password, createdAt).then(
      res.json({
        successMessage: "Successfully created a user",
      })
    );
  }
  return resError(
    res,
    500,
    "Please make sure you have filled out the form completely"
  );
});

export default router;
