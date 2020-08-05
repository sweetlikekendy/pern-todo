import axios from "axios";
import { TODOS_URI, SINGLE_TODO_URI } from "../../endpoints";

/**
 * Add a todo
 *
 * @param {object} event
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {string} todo New todo
 * @param {method} setTodo The react hook to set the new todo
 * @return {object} The response of the axios post request
 */
export const addTodo = (event, jwt, userId, todolistId, todo, setTodo) => {
  event.preventDefault();
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
      setTodo("");
    })
    .catch((error) => console.error(error));
};

/**
 * Delete a todo
 *
 * @param {object} event
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {number} todoId Todo's ID
 * @return {object} The response of the axios delete request
 */
export const deleteTodo = (event, jwt, userId, todolistId, todoId) => {
  event.preventDefault();
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
    .catch((error) => console.error(error));
};

/**
 * Edit a todo
 *
 * @param {object} event The number to raise.
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {string} todo New todo
 * @param {method} setTodo The react hook to set the new todo
 * @param {method} setShowInput The react hook to show/hide input field for title
 * @return {object} The response of the axios put request
 */
export const editTodo = (
  event,
  jwt,
  userId,
  todolistId,
  todoId,
  todo,
  setTodo,
  setShowInput
) => {
  event.preventDefault();

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
      setTodo("");
      setShowInput(false);
      console.log(response);
    })
    .catch((error) => console.error(error));
};
