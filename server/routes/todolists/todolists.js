import express from "express";
import { resStatusPayload, authorizeJwt } from "../../util";
import { todolistsRoutes } from "../../data/db/controllers/todolists";
import { todosRoutes } from "../../data/db/controllers/todos";
import { usersRoutes } from "../../data/db/controllers/users";
import { updateTodolist } from "../../../client/src/features/todolists/todolistsSlice";
const { getOne, getAll, updateOne, createOne, deleteOne } = todolistsRoutes;
const { getAll: getAllTodos } = todosRoutes;
const { getOneById: getOneUserById } = usersRoutes;

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
          let todoOrder = [];

          // add an id for react-drag-and-drop
          const todosWithdndId = todos.map((todo) => {
            // console.log({ [`${todo.id}`]: { ...todo, dndId: `todo-${todo.id}` } });
            return {
              // normalize
              // [`${todo.id}`]: { ...todo, dndId: `todo-${todo.id}` },
              ...todo,
              dndId: `todo-${todo.id}`,
            };
          });

          // if there are no todos in the todolist
          if (todos[0].id === null) {
            numOfTodos = 0;
            return {
              // numOfTodos,

              ...todolist,
              dndId: `todolist-${todolist.id}`,

              todos: [],
              todoOrder,
            };
          }

          // if there are todos in the todolist
          // get todo order
          todosWithdndId.forEach((todo) => {
            return todoOrder.push(todo.dndId);
          });

          return {
            // numOfTodos,

            ...todolist,
            dndId: `todolist-${todolist.id}`,

            todos: todosWithdndId,
            todoOrder,
          };
        });
        const todolists = await Promise.all(promises);

        // let todolistOrder = [];

        // todolists.forEach((todolist) => {
        //   todolistOrder.push(todolist.dndId);
        // });

        // console.log(todolists);
        const todolistsAsObject = todolists.map((todolist) => ({ [`${todolist.id}`]: { ...todolist } }));
        // const todolistsAsObject = todolists.reduce((obj, todolist) => ((obj[todolist.key] = todolist.value), obj), {});
        // const todolistsAsObject = Object.fromEntries(todolists.map((todolist) => [todolist.key, todolist.value]));
        // console.log("todolists as object", todolistsAsObject);

        // normalize my own todolist data for redux
        // return resStatusPayload(res, 200, todolistsAsObject);

        return resStatusPayload(res, 200, todolists);
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
    const todolist = await createOne(title, createdAt, user_id);

    const loggedInUser = await getOneUserById(user_id);

    if (loggedInUser) {
      delete loggedInUser.password;
    }

    const finalTodolist = {
      first_name: loggedInUser.first_name,
      last_name: loggedInUser.last_name,
      created_at: createdAt,
      updated_at: null,
      user_id,
      dndId: `todolist-${todolist[0].id}`,
      todos: [],
      todoOrder: [],
      ...todolist[0],
    };
    resStatusPayload(res, 201, finalTodolist);
  }
});

// Update todolist title
router.put("/:user_id/todolists/:todolist_id", authorizeJwt, async (req, res) => {
  const { todolist_id } = req.params;
  const { title } = req.body;
  const updatedAt = new Date();

  if (todolist_id) {
    try {
      const updatedTodolist = await updateOne(todolist_id, title, updatedAt);
      if (updatedTodolist.length > 0) {
        return resStatusPayload(res, 200, updatedTodolist[0]);
      }
      return resStatusPayload(res, 404, {
        isUpdated: false,
        message: "Todolist Not Found",
      });
    } catch (error) {
      console.error(`something went wrong`, error);
    }
  }
  return resStatusPayload(res, 500, {
    isUpdated: false,
    message: "Invalid Todolist ID",
  });
});

// Delete a todolist
router.delete("/:user_id/todolists/:todolist_id", authorizeJwt, async (req, res) => {
  const { todolist_id } = req.params;

  try {
    if (todolist_id) {
      const deletedTodolist = await deleteOne(todolist_id);

      if (deletedTodolist.length > 0) {
        return resStatusPayload(res, 200, deletedTodolist);
      }

      return resStatusPayload(res, 404, {
        isDeleted: false,
        message: "Todolist Not Found",
      });
      // .then((todolist) => {
      //   console.log(todolist);
      //   if (todolist) {
      //     return resStatusPayload(res, 200, {
      //       isDeleted: true,
      //       message: "Successfully deleted todolist",
      //     });
      //   }
      //   return resStatusPayload(res, 404, {
      //     isDeleted: false,
      //     message: "Todolist Not Found",
      //   });
      // })
      // .catch((err) => console.error(err));
    }
  } catch (error) {
    return resStatusPayload(res, 500, {
      isDeleted: false,
      message: "Invalid Todolist ID",
    });
  }
});

export default router;
