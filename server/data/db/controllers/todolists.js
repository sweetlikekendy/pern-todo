// Helper functions to query data from postgres with knex
import knex from "../index";

/**
 * Get one todolist by todolist ID
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {object} Knex object containing todolist data
 */
const getOne = (userId, todolistId) => {
  return knex("todolists").where("todolists.user_id", userId).where("id", todolistId).first();
};

/**
 * Get all todolists by a user by user ID
 *
 * @param {number} userId User's ID
 * @return {object} Knex object containing all the todolists a user has
 */
const getAll = (userId) => {
  return knex
    .select(
      // "first_name",
      // "last_name",
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

/**
 * Delete a todolist by the todolist ID
 *
 * @param {number} todlistId Todolist's ID
 * @return {object} Knex object confirming delete
 */
const deleteOne = (todolistId) => {
  return knex("todolists").where("id", todolistId).first().del().returning("*");
};

/**
 * Create a todolist for a user by user ID
 *
 * @param {string} title Todolist title
 * @param {object} createdAt Date todo was created at
 * @param {number} userId User's ID
 * @return {object} Knex object containing new todo created
 */
const createOne = async (title, createdAt, userId) => {
  return await knex("todolists")
    .insert([
      {
        title,
        created_at: createdAt,
        user_id: userId,
      },
    ])
    .then(async () => {
      return await knex
        .select(
          // "first_name",
          // "last_name",
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
    })
    .catch((error) => {
      console.log(error);
      return error;
    });
};

/**
 * Update a todolist by the todolist id
 *
 * @param {number} todolistId Todolist's ID
 * @param {string} title Todolist title
 * @param {object} updatedAt Date todo was updated at
 * @return {object} Knex object containing updated todo
 */
const updateOne = (todolistId, title, updatedAt) => {
  return knex("todolists")
    .where("id", todolistId)
    .first()
    .update({
      title,
      updated_at: updatedAt,
    })
    .returning("*");
};

export const todolistsRoutes = {
  getOne,
  getAll,
  deleteOne,
  createOne,
  updateOne,
};
