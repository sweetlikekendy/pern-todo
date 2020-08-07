// TODO Add later
const productionUri = `some production uri`;
export const ROOT_URI =
  process.env.NODE_ENV === `production`
    ? productionUri
    : `http://localhost:5000`;

// Login URI
export const LOGIN_URI =
  process.env.NODE_ENV === `production`
    ? `${ROOT_URI}`
    : `${ROOT_URI}/api/login`;

/**
 * Todolists URI
 *
 * @param {number} userId User's ID
 * @return {string} The URI/endpoint for a user's todolist(s).
 */
export const TODOLISTS_URI = (userId) =>
  process.env.NODE_ENV === `production`
    ? `${ROOT_URI}`
    : `${ROOT_URI}/api/users/${userId}/todolists`;

/**
 * Single todolist URI
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {string} The URI/endpoint for a user's specific todolist.
 */
export const SINGLE_TODOLIST_URI = (userId, todolistId) =>
  process.env.NODE_ENV === `production`
    ? `${ROOT_URI}`
    : `${ROOT_URI}/api/users/${userId}/todolists/${todolistId}`;

/**
 * Todos URI
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {string} The URI/endpoint for a user's todos in a specific todolist.
 */
export const TODOS_URI = (userId, todolistId) =>
  process.env.NODE_ENV === `production`
    ? `${ROOT_URI}`
    : `${ROOT_URI}/api/users/${userId}/todolists/${todolistId}/todos`;

/**
 * Single todo URI
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {number} todoId Todo's ID
 * @return {string} The URI/endpoint for a user's specific todos in a specific todolist.
 */
export const SINGLE_TODO_URI = (userId, todolistId, todoId) =>
  process.env.NODE_ENV === `production`
    ? `${ROOT_URI}`
    : `${ROOT_URI}/api/users/${userId}/todolists/${todolistId}/todos/${todoId}`;
