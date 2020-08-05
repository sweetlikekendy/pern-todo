import axios from "axios";
import { TODOLISTS_URI, SINGLE_TODOLIST_URI } from "../../endpoints";

/**
 * Add a todolist
 *
 * @param {object} event
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {string} todolist New todolist
 * @param {method} setTodolist The react hook to set the new todolist
 * @return {object} The response of the axios post request
 */
export const addTodolist = (event, jwt, userId, todolist, setTodolist) => {
  event.preventDefault();
  return axios
    .post(
      TODOLISTS_URI(userId),
      { title: todolist },
      {
        headers: {
          Authorization: jwt,
        },
      }
    )
    .then((response) => {
      setTodolist("");
      console.log(response);
    })
    .catch((error) => console.error(error));
};

/**
 * Delete a todolist
 *
 * @param {object} event
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {object} The response of the axios delete request
 */
export const deleteTodolist = (event, jwt, userId, todolistId) => {
  event.preventDefault();
  return axios
    .delete(SINGLE_TODOLIST_URI(userId, todolistId), {
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
 * Edit a todolist
 *
 * @param {object} event The number to raise.
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @param {string} title Title of new todolist
 * @param {string} todolist New todolist
 * @param {method} setTodolist The react hook to set the new todolist
 * @param {method} setShowInput The react hook to show/hide input field for title
 * @return {object} The response of the axios put request
 */
export const editTodolist = (
  event,
  jwt,
  userId,
  todolistId,
  todolist,
  setTodolist,
  setShowInput
) => {
  event.preventDefault();
  return axios
    .put(
      SINGLE_TODOLIST_URI(userId, todolistId),
      { title: todolist },
      {
        headers: {
          Authorization: jwt,
        },
      }
    )
    .then((response) => {
      setTodolist("");
      setShowInput(false);
      console.log(response);
    })
    .catch((error) => console.error(error));
};
