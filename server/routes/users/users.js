import express from "express";
import { resError } from "../resError";
import { usersRoutes } from "../../data/db/resources/users";

const { getOne, getAll, updateOne } = usersRoutes;

const router = express.Router();

// Get all users
router.get("/", (_req, res) => {
  return getAll()
    .then((users) => {
      const usersNoPass = [];
      users.map((user) => {
        delete user.password;
        usersNoPass.push(user);
      });
      return res.json({ users: usersNoPass, numOfUsers: usersNoPass.length });
    })
    .catch((err) => console.error(err));
});

// Get one user
router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!isNaN(id)) {
    return getOne(id)
      .then((user) => {
        if (user) {
          delete user.password;
          return res.json(user);
        }
        return resError(res, 404, "User Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid ID");
});

// Update user info
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;

  if (!isNaN(id)) {
    return updateOne(id, firstName, lastName, email, password)
      .then((user) => {
        if (user) {
          return res.json("Updated user info");
        }
        return resError(res, 404, "User Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid ID");
});

export default router;
