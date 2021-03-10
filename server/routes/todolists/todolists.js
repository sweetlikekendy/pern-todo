import express from "express";
import { resStatusPayload, authorizeJwt } from "../../util";
import { todolistsRoutes } from "../../data/db/controllers/todolists";
import { todosRoutes } from "../../data/db/controllers/todos";
const { getOne, getAll, updateOne, createOne, deleteOne } = todolistsRoutes;
const { getAll: getAllTodos } = todosRoutes;
const router = express.Router();

// Get all todolists for a user
router.get("/:user_id/todolists", authorizeJwt, async (req, res) => {
  const { user_id } = req.params;
  let numOfTodolists = 0;

  if (user_id) {
    return await getAll(user_id)
      .then((todolistRes) => {
        if (todolistRes.length > 0) {
          if (todolistRes[0].user_id !== null) {
            numOfTodolists = todolistRes.length;
          }

          return { todolistRes, numOfTodolists };
        }
        return resStatusPayload(res, 404, "Todolists not found");
      })
      .then(async (data) => {
        const { todolistRes, numOfTodolists } = data;
        const promises = todolistRes.map(async (todolist) => {
          const todos = await getAllTodos(user_id, todolist.id);
          let numOfTodos = todos.length;

          // add an id for react-drag-and-drop
          const todosWithdndId = todos.map((todo) => {
            return {
              ...todo,
              dndId: `todo-${todo.id}`,
            };
          });

          // if there are no todos in the todolist
          if (todos[0].id === null) {
            numOfTodos = 0;
            return {
              numOfTodos,
              todolist: {
                ...todolist,
                dndId: `todolist-${todolist.id}`,
              },
              todos: [],
            };
          }

          // if there are todos in the todolist
          return {
            numOfTodos,
            todolist: {
              ...todolist,
              dndId: `todolist-${todolist.id}`,
            },
            todos: todosWithdndId,
          };
        });
        const todolists = await Promise.all(promises);

        return resStatusPayload(res, 200, { numOfTodolists, todolists });
      })
      .catch((err) => console.error(err));
  }
  return resStatusPayload(res, 500, "Invalid User ID");
});

// Get one todolist
router.get("/:user_id/todolists/:todolist_id", authorizeJwt, async (req, res) => {
  const { user_id, todolist_id } = req.params;

  if (todolist_id) {
    return await getOne(user_id, todolist_id)
      .then(async (todolist) => {
        if (todolist) {
          const todos = await getAllTodos(user_id, todolist.id);

          // if there are no todos in the todolist
          if (todos[0].id === null) return resStatusPayload(res, 200, { numOfTodos: 0, todolist, todos: [] });

          // if there are todos in the todolist
          return resStatusPayload(res, 200, { numOfTodos: todos.length, todolist, todos });
        }
        return resStatusPayload(res, 404, "Todolist Not Found");
      })
      .catch((err) => console.error(err));
  }
  return resStatusPayload(res, 500, "Invalid Todolist ID");
});

// Create a todolist
router.post("/:user_id/todolists/", authorizeJwt, async (req, res) => {
  const { user_id } = req.params;
  const { title } = req.body;
  const createdAt = new Date();

  if (!title) {
    return resStatusPayload(res, 400, {
      isCreated: false,
      message: "Need a Title To Create a Todolist",
    });
  }

  if (title) {
    return await createOne(title, createdAt, user_id).then(
      resStatusPayload(res, 201, {
        isCreated: true,
        message: "Successfully created a todolist",
      })
    );
  }
});

// Update todolist title
router.put("/:user_id/todolists/:todolist_id", authorizeJwt, async (req, res) => {
  const { todolist_id } = req.params;
  const { title } = req.body;
  const updatedAt = new Date();

  if (todolist_id) {
    return await updateOne(todolist_id, title, updatedAt)
      .then((todolist) => {
        if (todolist) {
          return resStatusPayload(res, 200, {
            isUpdated: true,
            message: "Todolist Updated",
            updatedAt,
          });
        }
        return resStatusPayload(res, 404, {
          isUpdated: false,
          message: "Todolist Not Found",
        });
      })
      .catch((err) => console.error(err));
  }
  return resStatusPayload(res, 500, {
    isUpdated: false,
    message: "Invalid Todolist ID",
  });
});

// Delete a todolist
router.delete("/:user_id/todolists/:todolist_id", authorizeJwt, async (req, res) => {
  const { todolist_id } = req.params;

  if (todolist_id) {
    return await deleteOne(todolist_id)
      .then((todolist) => {
        if (todolist) {
          return resStatusPayload(res, 200, {
            isDeleted: true,
            message: "Successfully deleted todolist",
          });
        }
        return resStatusPayload(res, 404, {
          isDeleted: false,
          message: "Todolist Not Found",
        });
      })
      .catch((err) => console.error(err));
  }
  return resStatusPayload(res, 500, {
    isDeleted: false,
    message: "Invalid Todolist ID",
  });
});

export default router;
