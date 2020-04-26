// Helper functions to query data from postgres with knex
import knex from "../index";

export const getOne = (id) => {
  return knex("todolists").where("id", id).first();
};
export const getAll = (id) => {
  return knex("todolists");
};

export const deleteOne = (id) => {
  return knex("todolists").where("id", id).first().del();
};

export const createOne = (id) => {
  return knex("todolists").where("id", id).first().del();
};

export const todolistsRoutes = {
  getOne,
  getAll,
  deleteOne,
  createOne,
};
