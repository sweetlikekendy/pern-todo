import express from "express";
import { resStatusPayload } from "../../util";
import { usersRoutes } from "../../data/db/controllers/users";

const { getOneById, getAll, updateOne } = usersRoutes;

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
      return resStatusPayload(res, 200, {
        users: usersNoPass,
        numOfUsers: usersNoPass.length,
      });
    })
    .catch((err) => console.error(err));
});

// Get one user by id
router.get("/:id", (req, res) => {
  const { id } = req.params;
  if (!isNaN(id)) {
    return getOneById(id)
      .then((user) => {
        if (user) {
          delete user.password;
          return resStatusPayload(res, 200, { user });
        }
        return resStatusPayload(res, 404, "User Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resStatusPayload(res, 500, "Invalid ID");
});

// Update user info
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, email, password } = req.body;
  const updatedAt = new Date();

  if (!isNaN(id)) {
    return updateOne(id, firstName, lastName, email, password, updatedAt)
      .then((user) => {
        if (user) {
          return resStatusPayload(res, 200, {
            isUpdated: true,
            message: "Updated user info",
            updatedAt,
          });
        }
        return resStatusPayload(res, 404, "User Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resStatusPayload(res, 500, "Invalid ID");
});

export default router;
