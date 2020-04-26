import express from "express";
import { usersRoutes } from "../../data/db/util/users";

const { createOne } = usersRoutes;

const router = express.Router();

// Create a user
router.post("/", (req, res) => {
  console.log("creating a user");
  const { firstName, lastName, email, password } = req.body;
  const createdAt = new Date();

  console.log(firstName, lastName, email, password, createdAt);

  if (firstName && lastName && email && password && createdAt) {
    return createOne(firstName, lastName, email, password, createdAt).then(
      (user) =>
        res.json({
          successMessage: "Successfully created a user",
        })
    );
  }
});

export default router;
