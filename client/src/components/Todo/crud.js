import axios from "axios";
import { TODOS_URI, SINGLE_TODO_URI } from "../../endpoints";

/**
 * Add a todo
 *
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {string} todo New todo
 * @param {method} setTodo The react hook to set the new todo
 * @return {object} The response of the axios post request
 */
export const addTodo = (jwt, userId, todolistId, todo) => {
  axios
    .post(
      TODOS_URI(userId, todolistId),
      { description: todo },
      {
        headers: {
          Authorization: jwt,
        },
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.error(error.response.request));
};

/**
 * Delete a todo
 *
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {number} todoId Todo's ID
 * @return {object} The response of the axios delete request
 */
export const deleteTodo = (jwt, userId, todolistId, todoId) => {
  console.log(todoId);
  return axios
    .delete(SINGLE_TODO_URI(userId, todolistId, todoId), {
      headers: {
        Authorization: jwt,
      },
    })
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.error(error.response.request));
};

/**
 * Edit a todo
 *
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {string} todo New todo
 * @return {object} The response of the axios put request
 */
export const editTodo = (jwt, userId, todolistId, todoId, todo) => {
  return axios
    .put(
      SINGLE_TODO_URI(userId, todolistId, todoId),
      { description: todo },
      {
        headers: {
          Authorization: jwt,
        },
      }
    )
    .then((response) => {
      console.log(response);
    })
    .catch((error) => console.error(error.response.request));
};
