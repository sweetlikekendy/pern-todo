// Helper functions to query data from postgres with knex
import knex from "../index";

/**
 * Get a user by the user ID
 *
 * @param {number} userId User's ID
 * @return {object} Knex object containing user's account information
 */
const getOneById = (userId) => {
  return knex("users").where("id", userId).first();
};

/**
 * Get a user by email
 *
 * @param {string} userEmail User's email linked to account
 * @return {object} Knex object containing user's account information
 */
const getOneByEmail = (userEmail) => {
  return knex("users").where("email", userEmail).first();
};

/**
 * Get all users
 *
 * @return {object} Knex object containing all the users using the app
 */
const getAll = () => {
  return knex("users");
};

/**
 * Create a user
 *
 * @param {string} first_name User's first name
 * @param {string} last_name User's last name
 * @param {string} email User's email
 * @param {string} password User's hashed password
 * @param {object} createdAt Date user was created at
 * @return {object} Knex object containing new user created
 */
const createOne = (first_name, last_name, email, password, created_at) => {
  return knex("users")
    .select()
    .where("email", email)
    .then((rows) => {
      if (rows.length === 0) {
        // no matching records found
        return knex("users").returning("id", "first_name", "last_name", "email", "created_at").insert([
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

/**
 * Update a user by user ID
 *
 * @param {string} first_name User's first name
 * @param {string} last_name User's last name
 * @param {string} email User's email
 * @param {string} password User's hashed password
 * @param {object} updatedAt Date todo was updated at
 * @return {object} Knex object containing updated user
 */
const updateOne = (userId, firstName, lastName, email, password, updatedAt) => {
  return knex("users").where("id", userId).first().update({
    first_name: firstName,
    last_name: lastName,
    email,
    password,
    updated_at: updatedAt,
  });
};

export const usersRoutes = {
  getOneById,
  getOneByEmail,
  getAll,
  createOne,
  updateOne,
};
