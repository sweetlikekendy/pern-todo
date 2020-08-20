import express from "express";
import { resStatusPayload, authorizeJwt } from "../../util";
import { todosRoutes } from "../../data/db/controllers/todos";

const { getOne, getAll, updateOne, createOne, deleteOne } = todosRoutes;

const router = express.Router();

// Get all todos in a todolist for a user
router.get(
  "/:user_id/todolists/:todolist_id/todos",
  authorizeJwt,
  async (req, res) => {
    const { user_id, todolist_id } = req.params;

    if (todolist_id) {
      return await getAll(user_id, todolist_id)
        .then((todos) => {
          if (todos.length > 0) {
            let numOfTodos = 0;
            if (todos[0].todolist_id !== null) {
              numOfTodos = todos.length;
            }
            return resStatusPayload(res, 200, { todos: todos, numOfTodos });
          }
          return resStatusPayload(res, 404, { message: "Todos not found" });
        })
        .catch((err) => console.error(err));
    }
    return resStatusPayload(res, 500, {
      message: "Invalid User ID or Invalid Todolist ID.",
    });
  }
);

// Get one todo
router.get(
  "/:user_id/todolists/:todolist_id/todos/:todo_id",
  authorizeJwt,
  async (req, res) => {
    const { user_id, todolist_id, todo_id } = req.params;

    if (todo_id) {
      return await getOne(todo_id)
        .then((todo) => {
          if (todo) {
            return resStatusPayload(res, 200, todo);
          }
          return resStatusPayload(res, 404, { message: "Todo Not Found" });
        })
        .catch((err) => console.error(err));
    }
    return resStatusPayload(res, 500, { message: "Invalid Todo ID" });
  }
);

// Create a todo for a todolist
router.post(
  "/:user_id/todolists/:todolist_id/todos",
  authorizeJwt,
  async (req, res) => {
    const { user_id, todolist_id } = req.params;
    const { description } = req.body;
    const createdAt = new Date();

    if (description && !isNaN(todolist_id)) {
      return await createOne(description, createdAt, todolist_id).then(
        resStatusPayload(res, 201, {
          isCreated: true,
          message: "Successfully created a todo",
        })
      );
    }
    return resStatusPayload(res, 500, {
      isCreated: false,
      message: "Invalid Todolist ID",
    });
  }
);

// Update todo description for a todolist
router.put(
  "/:user_id/todolists/:todolist_id/todos/:todo_id",
  authorizeJwt,
  async (req, res) => {
    const { todolist_id, todo_id } = req.params;
    const { description, newTodolistId } = req.body;
    const updatedAt = new Date();

    if (todo_id) {
      return await updateOne(todo_id, description, newTodolistId, updatedAt)
        .then((todo) => {
          if (todo) {
            return resStatusPayload(res, 200, {
              isUpdated: true,
              message: "Updated todo info",
              updatedAt,
            });
          }
          return resStatusPayload(res, 404, {
            isUpdated: false,
            message: "Todo Not Found",
          });
        })
        .catch((err) => console.error(err));
    }
    return resStatusPayload(res, 500, {
      isUpdated: false,
      message: "Invalid Todo ID",
    });
  }
);

// Delete a todo in a todolist
router.delete(
  "/:user_id/todolists/:todolist_id/todos/:todo_id",
  authorizeJwt,
  async (req, res) => {
    const { todolist_id, todo_id } = req.params;

    if (todo_id) {
      return await deleteOne(todo_id)
        .then((todo) => {
          if (todo) {
            return resStatusPayload(res, 200, {
              isDeleted: true,
              message: "Successfully deleted todo",
            });
          }
          return resStatusPayload(res, 404, {
            isDeleted: true,
            message: "Todo Not Found",
          });
        })
        .catch((err) => console.error(err));
    }
    return resStatusPayload(res, 500, {
      isDeleted: true,
      message: "Invalid Todo ID",
    });
  }
);

export default router;
