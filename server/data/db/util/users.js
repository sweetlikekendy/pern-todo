// Helper functions to query data from postgres with knex
import knex from "../index";

export const getOne = (id) => {
  return knex("users").where("id", id).first();
};

export const getAll = () => {
  return knex("users");
};

export const createOne = (firstName, lastName, email, password, createdAt) => {
  return knex("users").insert([
    {
      first_name: firstName,
      last_name: lastName,
      email,
      password,
      created_at: createdAt,
    },
  ]);
};

export const usersRoutes = {
  getOne,
  getAll,
  createOne,
};
