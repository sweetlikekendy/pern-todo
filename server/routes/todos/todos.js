import express from "express";
import { resError } from "../resError";
import { todosRoutes } from "../../data/db/util/todos";

const { getOne, getAll, updateOne, createOne, deleteOne } = todosRoutes;

const router = express.Router();

// Get all todos in a todolist for a user
router.get("/:user_id/todolists/:todolist_id/todos", (req, res) => {
  const { user_id, todolist_id } = req.params;

  if (isNaN(user_id) || isNaN(todolist_id)) {
    return resError(res, 500, "Invalid User ID or Invalid Todolist ID.");
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

// Get one todo
router.get("/:user_id/todolists/:todolist_id/todos/:todo_id", (req, res) => {
  const { user_id, todolist_id, todo_id } = req.params;

  if (todo_id) {
    return getOne(todo_id)
      .then((todo) => {
        if (todo) {
          return res.json(todo);
        }
        return resError(res, 404, "Todo Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid Todo ID");
});

// Create a todo for a todolist
router.post("/:user_id/todolists/:todolist_id/todos", (req, res) => {
  const { user_id, todolist_id } = req.params;
  const { description } = req.body;
  const createdAt = new Date();

  if (description && createdAt && isNaN(todolist_id)) {
    return createOne(description, createdAt, todolist_id).then(
      res.json({
        successMessage: "Successfully created a todo",
      })
    );
  }
  return resError(res, 500, "Invalid Todolist ID");
});

// Update todo description for a todolist
router.put("/:user_id/todolists/:todolist_id/todos/:todo_id", (req, res) => {
  const { todolist_id, todo_id } = req.params;
  const { description } = req.body;

  if (todo_id) {
    return updateOne(todo_id, description)
      .then((todo) => {
        if (todo) {
          return res.json("Updated todo info");
        }
        return resError(res, 404, "Todo Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid Todo ID");
});

// Delete a todo in a todolist
router.delete("/:user_id/todolists/:todolist_id/todos/:todo_id", (req, res) => {
  const { todolist_id, todo_id } = req.params;

  if (todo_id) {
    return deleteOne(todo_id)
      .then((todo) => {
        if (todo) {
          return res.json({ successMessage: "Successfully deleted todo" });
        }
        return resError(res, 404, "Todo Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resError(res, 500, "Invalid Todo ID");
});

export default router;
