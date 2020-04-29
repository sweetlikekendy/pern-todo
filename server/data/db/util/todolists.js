// Helper functions to query data from postgres with knex
import knex from "../index";

const getOne = (id) => {
  return knex("todolists").where("id", id).first();
};

const getAll = (id) => {
  return knex
    .select("first_name", "last_name", "todolists.id", "title")
    .from("users")
    .leftJoin("todolists", "users.id", "=", "todolists.user_id")
    .where("users.id", id);
};

const deleteOne = (id) => {
  return knex("todolists").where("id", id).first().del();
};

const createOne = (title, createdAt, userId) => {
  return knex("todolists").insert([
    {
      title,
      created_at: createdAt,
      user_id: userId,
    },
  ]);
};

const updateOne = (id, title) => {
  return knex("todolists").where("id", id).first().update({
    title,
  });
};

export const todolistsRoutes = {
  getOne,
  getAll,
  deleteOne,
  createOne,
  updateOne,
};
