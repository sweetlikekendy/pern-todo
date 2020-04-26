// Helper functions to query data from postgres with knex
import knex from "../index";

const getOne = (id) => {
  return knex("users").where("id", id).first();
};

const getAll = () => {
  return knex("users");
};

const createOne = (firstName, lastName, email, password, createdAt) => {
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

const updateOne = (id, firstName, lastName, email, password) => {
  return knex("users").where("id", id).first().update({
    first_name: firstName,
    last_name: lastName,
    email,
    password,
  });
};

export const usersRoutes = {
  getOne,
  getAll,
  createOne,
  updateOne,
};
