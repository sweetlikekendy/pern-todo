// Helper functions to query data from postgres with knex
import knex from "../index";

// Get a user by the user ID
const getOne = (userId) => {
  return knex("users").where("id", userId).first();
};

// Get all users
const getAll = () => {
  return knex("users");
};

// Create a user
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

// Update a user by user ID
const updateOne = (userId, firstName, lastName, email, password) => {
  return knex("users").where("id", userId).first().update({
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
