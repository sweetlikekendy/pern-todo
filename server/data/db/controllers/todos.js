// Helper functions to query data from postgres with knex
import knex from "../index";

// Get one todo by todo ID
const getOne = (todoId) => {
  return knex("todos").where("id", todoId).first();
};

// Get all todos in a todolist by todolist ID
const getAll = (userId, todolistId) => {
  return knex
    .select(
      "first_name",
      "last_name",
      "todos.todolist_id",
      "todos.id",
      "title",
      "description"
    )
    .from("users")
    .leftJoin("todolists", "users.id", "=", "todolists.user_id")
    .leftJoin("todos", "todolists.id", "=", "todos.todolist_id")
    .where("todolists.user_id", userId)
    .where("todolists.id", todolistId);
};

// Delete a todo by the todo ID
const deleteOne = (todoId) => {
  return knex("todos").where("id", todoId).first().del();
};

// Create a todo in a todolist by todolist ID
const createOne = (description, createdAt, todolistId) => {
  return knex("todos").insert([
    {
      description,
      created_at: createdAt,
      todolist_id: todolistId,
    },
  ]);
};

// Update a todo by the todo id
const updateOne = (todoId, description) => {
  return knex("todos").where("id", todoId).first().update({
    description,
  });
};

export const todosRoutes = {
  getOne,
  getAll,
  deleteOne,
  createOne,
  updateOne,
};
