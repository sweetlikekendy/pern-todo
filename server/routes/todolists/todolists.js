import express from "express";
import { resError } from "../resError";
import { todolistsRoutes } from "../../data/db/util/todolists";

const { getOne, getAll, updateOne, createOne, deleteOne } = todolistsRoutes;

const router = express.Router();

// Get all todolists for a user
router.get("/:user_id/todolists", (req, res) => {
  const { user_id } = req.params;

  if (isNaN(user_id)) {
    return resError(res, 500, "Invalid User ID");
  }

  if (user_id) {
    return getAll(user_id)
      .then((todolists) => {
        if (todolists) {
          return res.json(todolists);
        }
        return resError(res, 404, "User not found");
      })
      .catch((err) => console.error(err));
  }
});

// Get one todolist
router.get("/:user_id/todolists/:todolist_id", (req, res) => {
  const { user_id, todolist_id } = req.params;

  if (todolist_id) {
    return getOne(todolist_id)
      .then((todolist) => {
        if (todolist) {
          return res.json(todolist);
        }
        return resError(res, 404, "Todolist Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid Todolist ID");
});

// Create a todolist
router.post("/:user_id/todolists/", (req, res) => {
  const { user_id } = req.params;
  const { title } = req.body;
  const createdAt = new Date();

  if (title && createdAt) {
    return createOne(title, createdAt, user_id).then(
      res.json({
        successMessage: "Successfully created a todolist",
      })
    );
  }
});

// Update todolist title
router.put("/:user_id/todolists/:todolist_id", (req, res) => {
  const { todolist_id } = req.params;
  const { title } = req.body;

  if (todolist_id) {
    return updateOne(todolist_id, title)
      .then((todolist) => {
        if (todolist) {
          return res.json("Updated todolist info");
        }
        return resError(res, 404, "Todolist Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid Todolist ID");
});

// Delete a todolist
router.delete("/:user_id/todolists/:todolist_id", (req, res) => {
  const { todolist_id } = req.params;

  if (todolist_id) {
    return deleteOne(todolist_id)
      .then((todolist) => {
        if (todolist) {
          return res.json({ successMessage: "Successfully deleted todolist" });
        }
        return resError(res, 404, "Todolist Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid Todolist ID");
});

export default router;
