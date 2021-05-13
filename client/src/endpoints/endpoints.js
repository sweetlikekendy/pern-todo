/* eslint-disable no-undef */
// TODO Add later
const productionUri = process.env.REACT_APP_API_URL;
export const ROOT_URI = process.env.NODE_ENV === `production` ? productionUri : `http://localhost:5000`;

// Login URI
export const LOGIN_URI = `${ROOT_URI}/api/login`;

// all users
export const ALL_USERS = `${ROOT_URI}/api/users`;

/**
 * Todolists URI
 *
 * @param {number} userId User's ID
 * @return {string} The URI/endpoint for a user's todolist(s).
 */
export const TODOLISTS_URI = (userId) => `${ROOT_URI}/api/users/${userId}/todolists`;

/**
 * Single todolist URI
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {string} The URI/endpoint for a user's specific todolist.
 */
export const SINGLE_TODOLIST_URI = (userId, todolistId) => `${ROOT_URI}/api/users/${userId}/todolists/${todolistId}`;

/**
 * Todos URI
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {string} The URI/endpoint for a user's todos in a specific todolist.
 */
export const TODOS_URI = (userId, todolistId) => `${ROOT_URI}/api/users/${userId}/todolists/${todolistId}/todos`;

/**
 * Single todo URI
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {number} todoId Todo's ID
 * @return {string} The URI/endpoint for a user's specific todos in a specific todolist.
 */
export const SINGLE_TODO_URI = (userId, todolistId, todoId) =>
  `${ROOT_URI}/api/users/${userId}/todolists/${todolistId}/todos/${todoId}`;

/**
 *  Batch delete completed todos
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {array} completedTodoIds Completed Todo IDs
 * @return {string} The URI/endpoint for a user's completed todos in a specific todolist.
 */
export const DELETE_COMPLETED_TODO_URI = (userId, todolistId) =>
  `${ROOT_URI}/api/users/${userId}/todolists/${todolistId}/delete-completed-todos`;

/**
 *  Batch update todos to completed
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {array} completedTodoIds Completed Todo IDs
 * @return {string} The URI/endpoint for a user's completed todos in a specific todolist.
 */
export const SET_TODOS_TO_COMPLETE = (userId, todolistId) =>
  `${ROOT_URI}/api/users/${userId}/todolists/${todolistId}/batch-set-todos`;
