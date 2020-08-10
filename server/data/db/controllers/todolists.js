// Helper functions to query data from postgres with knex
import knex from "../index";

// Get one todolist by todolist ID
const getOne = (userId, todolistId) => {
  return knex("todolists")
    .where("todolists.user_id", userId)
    .where("id", todolistId)
    .first();
};

// Get all todolists by a user by user ID
const getAll = (userId) => {
  return knex
    .select(
      "first_name",
      "last_name",
      "todolists.created_at",
      "todolists.updated_at",
      "todolists.user_id",
      "todolists.id",
      "title"
    )
    .from("users")
    .leftJoin("todolists", "users.id", "=", "todolists.user_id")
    .where("users.id", userId)
    .orderBy("todolists.created_at", "desc");
};

// Delete a todolist by the todolist ID
const deleteOne = (todolistId) => {
  return knex("todolists").where("id", todolistId).first().del();
};

// Create a todolist for a user by user ID
const createOne = (title, createdAt, userId) => {
  return knex("todolists").insert([
    {
      title,
      created_at: createdAt,
      user_id: userId,
    },
  ]);
};

// Update a todolist by the todolist id
const updateOne = (todolistId, title, updatedAt) => {
  return knex("todolists").where("id", todolistId).first().update({
    title,
    updated_at: updatedAt,
  });
};

export const todolistsRoutes = {
  getOne,
  getAll,
  deleteOne,
  createOne,
  updateOne,
};
