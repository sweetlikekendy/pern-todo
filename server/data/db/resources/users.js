// Helper functions to query data from postgres with knex
import knex from "../index";

// Get a user by the user ID
const getOneById = (userId) => {
  return knex("users").where("id", userId).first();
};

// Get a user by email
const getOneByEmail = (userEmail) => {
  return knex("users").where("email", userEmail).first();
};

// Get all users
const getAll = () => {
  return knex("users");
};

// create a user
const createOne = (first_name, last_name, email, password, created_at) => {
  return knex("users")
    .select()
    .where("email", email)
    .then((rows) => {
      if (rows.length === 0) {
        // no matching records found
        return knex("users").returning("id").insert([
          {
            first_name,
            last_name,
            email,
            password,
            created_at,
          },
        ]);
      } else {
        // duplicate email found
        return {
          message: "An account already exists with this email",
          duplicateEmail: true,
        };
      }
    })
    .catch((err) => {
      console.error(err);
    });
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
  getOneById,
  getOneByEmail,
  getAll,
  createOne,
  updateOne,
};
