import express from "express";
import { resStatusPayload, authorizeJwt } from "../../util";
import { todolistsRoutes } from "../../data/db/controllers/todolists";
const { getOne, getAll, updateOne, createOne, deleteOne } = todolistsRoutes;

const router = express.Router();

// Get all todolists for a user
router.get("/:user_id/todolists", authorizeJwt, async (req, res) => {
  const { user_id } = req.params;

  if (user_id) {
    return await getAll(user_id)
      .then((todolists) => {
        if (todolists.length > 0) {
          let numOfTodolists = 0;
          if (todolists[0].user_id !== null) {
            numOfTodolists = todolists.length;
          }
          return resStatusPayload(res, 200, {
            todolists: todolists,
            numOfTodolists,
          });
        }
        return resStatusPayload(res, 404, "Todolists not found");
      })
      .catch((err) => console.error(err));
  }
  return resStatusPayload(res, 500, "Invalid User ID");
});

// Get one todolist
router.get(
  "/:user_id/todolists/:todolist_id",
  authorizeJwt,
  async (req, res) => {
    const { user_id, todolist_id } = req.params;

    if (todolist_id) {
      return await getOne(user_id, todolist_id)
        .then((todolist) => {
          if (todolist) {
            return resStatusPayload(res, 200, todolist);
          }
          return resStatusPayload(res, 404, "Todolist Not Found");
        })
        .catch((err) => console.error(err));
    }
    return resStatusPayload(res, 500, "Invalid Todolist ID");
  }
);

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
router.put(
  "/:user_id/todolists/:todolist_id",
  authorizeJwt,
  async (req, res) => {
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
  }
);

// Delete a todolist
router.delete(
  "/:user_id/todolists/:todolist_id",
  authorizeJwt,
  async (req, res) => {
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
  }
);

export default router;
