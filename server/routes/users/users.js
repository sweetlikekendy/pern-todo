import express from "express";
import { usersRoutes } from "../../data/db/util/users";

const { getOne, getAll } = usersRoutes;

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
      return res.json(usersNoPass);
    })
    .catch((err) => console.error(err));
});

// Get one user
router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (id) {
    return getOne(id).then((user) => {
      if (user) {
        delete user.password;
        return res.json(user);
      }
      return resError(res, 404, "User Not Found");
    });
  }
  return resError(res, 500, "Invalid ID");
});

function resError(res, statusCode, message) {
  res.status(statusCode);
  res.json({ message });
}

export default router;
