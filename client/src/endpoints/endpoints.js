/**
 * Todolists URI
 *
 * @param {number} userId User's ID
 * @return {string} The URI/endpoint for a user's todolist(s).
 */
export const TODOLISTS_URI = (userId) =>
  process.env.NODE_ENV === `production`
    ? `some production uri`
    : `http://localhost:5000/api/users/${userId}/todolists`;

/**
 * Single todolist URI
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {string} The URI/endpoint for a user's specific todolist.
 */
export const SINGLE_TODOLIST_URI = (userId, todolistId) =>
  process.env.NODE_ENV === `production`
    ? `some production uri`
    : `http://localhost:5000/api/users/${userId}/todolists/${todolistId}`;

/**
 * Todos URI
 *
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {string} The URI/endpoint for a user's todos in a specific todolist.
 */
export const TODOS_URI = (userId, todolistId) =>
  process.env.NODE_ENV === `production`
    ? `some production uri`
    : `http://localhost:5000/api/users/${userId}/todolists/${todolistId}/todos`;

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
    ? `some production uri`
    : `http://localhost:5000/api/users/${userId}/todolists/${todolistId}/todos/${todoId}`;
