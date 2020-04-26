import express from "express";
import { resError } from "../resError";
import { todolistsRoutes } from "../../data/db/util/todolists";

const { getOne, getAll, updateOne, createOne, deleteOne } = todolistsRoutes;

const router = express.Router();

// Get all todolists
router.get("/", (_req, res) => {
  return getAll()
    .then((todolists) => {
      return res.json(todolists);
    })
    .catch((err) => console.error(err));
});

// Get one todolist
router.get("/:todolist_id", (req, res) => {
  const { todolist_id } = req.params;

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
router.post("/", (req, res) => {
  const { user_id } = req.params;
  const { title } = req.body;
  const createdAt = new Date();

  if (title && createdAt) {
    return createOne(title, createdAt).then(
      res.json({
        successMessage: "Successfully created a todolist",
      })
    );
  }
});

// Update todolist title
router.put("/:todolist_id", (req, res) => {
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
router.delete("/:todolist_id", (req, res) => {
  const { todolist_id } = req.params;

  if (todolist_id) {
    return deleteOne(todolist_id)
      .then(res.json({ successMessage: "Successfully deleted a user" }))
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid Todolist ID");
});

export default router;
