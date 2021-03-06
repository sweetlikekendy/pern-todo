import express from "express";
import { resStatusPayload, authorizeJwt } from "../../util";
import { todosRoutes } from "../../data/db/controllers/todos";
const { getOne, getAll, updateOne, updateMany, createOne, deleteOne, deleteMany } = todosRoutes;

const router = express.Router();

// Get all todos in a todolist for a user
router.get("/:user_id/todolists/:todolist_id/todos", authorizeJwt, async (req, res) => {
  const { user_id, todolist_id } = req.params;

  if (todolist_id) {
    return await getAll(user_id, todolist_id)
      .then((todos) => {
        if (todos.length > 0) {
          let numOfTodos = 0;

          // set number of todos in a todolist
          if (todos[0].todolist_id !== null) {
            numOfTodos = todos.length;
          }

          // add an id for react-drag-and-drop
          const todosWithdndId = todos.map((todo) => {
            return {
              ...todo,
              dndId: `todo-${todo.id}`,
            };
          });

          return resStatusPayload(res, 200, { todos: todosWithdndId, numOfTodos });
        }
      })
      .catch((error) => {
        console.error(error);
        return resStatusPayload(res, 404, { message: error.message });
      });
  }
  return resStatusPayload(res, 500, {
    message: "Invalid User ID or Invalid Todolist ID.",
  });
});

// Get one todo
router.get("/:user_id/todolists/:todolist_id/todos/:todo_id", authorizeJwt, async (req, res) => {
  const { user_id, todolist_id, todo_id } = req.params;

  if (todo_id) {
    return await getOne(todo_id)
      .then((todo) => {
        if (todo) {
          return resStatusPayload(res, 200, todo);
        }
      })
      .catch((error) => {
        console.error(error);
        return resStatusPayload(res, 404, { message: error.message });
      });
  }
  return resStatusPayload(res, 500, { message: "Invalid Todo ID" });
});

// Create a todo for a todolist
router.post("/:user_id/todolists/:todolist_id/todos", authorizeJwt, async (req, res) => {
  const { user_id, todolist_id } = req.params;
  const { description } = req.body;
  const createdAt = new Date();

  if (description && !isNaN(todolist_id)) {
    try {
      const newTodo = await createOne(description, createdAt, todolist_id);

      if (newTodo.length > 0) {
        return resStatusPayload(res, 201, newTodo[0]);
      }
    } catch (error) {
      console.error(error);
      return resStatusPayload(res, 400, { isCreated: false, message: error.message });
    }
  }
  return resStatusPayload(res, 500, {
    isCreated: false,
    message: "Invalid Todolist ID",
  });
});

// Update a todo for a todolist
router.put("/:user_id/todolists/:todolist_id/todos/:todo_id", authorizeJwt, async (req, res) => {
  const { todo_id } = req.params;
  const { options } = req.body;
  const { updateTodoDescription, toggleTodoCompletion } = options;

  const requestOptions = {
    ...req.params,
    ...req.body,
  };

  if (todo_id) {
    if (updateTodoDescription) {
      try {
        const updatedTodo = await updateOne(requestOptions);

        if (updatedTodo.length > 0) {
          return resStatusPayload(res, 200, updatedTodo[0]);
        }
      } catch (error) {
        console.error(error);
        return resStatusPayload(res, 400, { isCreated: false, message: "BAD REQUEST" });
      }
    }

    if (toggleTodoCompletion) {
      try {
        const updatedTodo = await updateOne(requestOptions);

        if (updatedTodo.length > 0) {
          return resStatusPayload(res, 200, updatedTodo[0]);
        }
      } catch (error) {
        console.error(error);
        return resStatusPayload(res, 400, { isCreated: false, message: "BAD REQUEST" });
      }
    }
  }
  return resStatusPayload(res, 500, {
    isUpdated: false,
    message: "Invalid Todo ID",
  });
});

// Delete a todo in a todolist
router.delete("/:user_id/todolists/:todolist_id/todos/:todo_id", authorizeJwt, async (req, res) => {
  const { todolist_id, todo_id } = req.params;

  if (todo_id) {
    try {
      const deleteTodo = await deleteOne(todo_id);
      if (deleteTodo.length > 0) {
        return resStatusPayload(res, 200, deleteTodo[0]);
      }
    } catch (error) {
      return resStatusPayload(res, 400, {
        isDeleted: false,
        message: "BAD REQUEST",
      });
    }
  }
  return resStatusPayload(res, 500, {
    isDeleted: false,
    message: "Invalid Todo ID",
  });
});

// Delete all completed todo in a todolist
router.delete("/:user_id/todolists/:todolist_id/delete-completed-todos", authorizeJwt, async (req, res) => {
  const { todolist_id } = req.params;
  const { completeTodoIds } = req.body;

  const isCompletedTodosEmpty = completeTodoIds.length > 0 ? false : true;

  if (!isCompletedTodosEmpty) {
    try {
      const deleteCompletedTodos = await deleteMany(completeTodoIds);
      if (deleteCompletedTodos.length > 0) {
        return resStatusPayload(res, 200, deleteCompletedTodos);
      }
    } catch (error) {
      return resStatusPayload(res, 400, {
        isDeleted: false,
        message: error.message,
      });
    }
  }
  return resStatusPayload(res, 500, {
    isDeleted: false,
    message: "Something is wrong with the server you're trying to connect to. Please wait and try again later.",
  });
});

// Set multiple todos to complete
router.patch("/:user_id/todolists/:todolist_id/batch-set-todos", authorizeJwt, async (req, res) => {
  const { todolist_id } = req.params;
  const { todoIds, setComplete } = req.body;

  const isTodosToBeSetEmpty = todoIds.length > 0 ? false : true;

  if (!isTodosToBeSetEmpty) {
    try {
      const updatedTodos = await updateMany(todoIds, setComplete);

      if (updatedTodos.length > 0) {
        return resStatusPayload(res, 200, updatedTodos);
      }
    } catch (error) {
      // throw error;
      return resStatusPayload(res, 400, {
        isDeleted: false,
        message: error.message,
      });
    }
  }
  return resStatusPayload(res, 500, {
    isDeleted: false,
    message: "Something is wrong with the server you're trying to connect to. Please wait and try again later.",
  });
});

export default router;
