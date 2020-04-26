// Helper functions to query data from postgres with knex
import knex from "../index";

const getOne = (id) => {
  return knex("todolists").where("id", id).first();
};

const getAll = () => {
  return knex("todolists");
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

const updateOne = (todolistId, title) => {
  return knex("todolists").where("id", todolistId).first().update({
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
