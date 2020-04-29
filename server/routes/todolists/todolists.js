import express from "express";
import { resError } from "../resError";
import { todolistsRoutes } from "../../data/db/resources/todolists";

const { getOne, getAll, updateOne, createOne, deleteOne } = todolistsRoutes;

const router = express.Router();

// Get all todolists for a user
router.get("/:user_id/todolists", (req, res) => {
  const { user_id } = req.params;

  if (user_id) {
    return getAll(user_id)
      .then((todolists) => {
        if (todolists.length > 0) {
          let numOfTodolists = 0;
          if (todolists[0].user_id !== null) {
            numOfTodolists = todolists.length;
          }
          return res.json({
            todolists: todolists,
            numOfTodolists,
          });
        }
        return resError(res, 404, "Todolists not found");
      })
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid User ID");
});

// Get one todolist
router.get("/:user_id/todolists/:todolist_id", (req, res) => {
  const { user_id, todolist_id } = req.params;

  if (todolist_id) {
    return getOne(user_id, todolist_id)
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
