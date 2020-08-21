import axios from "axios";
import { TODOLISTS_URI, SINGLE_TODOLIST_URI } from "../../endpoints";

/**
 * Add a todolist
 *
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {string} todolist New todolist
 * @param {method} setTodolist The react hook to set the new todolist
 * @return {object} The response of the axios post request
 */
export const addTodolist = async (jwt, userId, todolist, setTodolist) => {
  const data = await axios
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
    .catch((error) => console.error(error.response.request));

  return data;
};

/**
 * Delete a todolist
 *
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {number} todolistId Todolist's ID
 * @return {object} The response of the axios delete request
 */
export const deleteTodolist = (jwt, userId, todolistId) => {
  return axios
    .delete(SINGLE_TODOLIST_URI(userId, todolistId), {
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
 * Edit a todolist
 *
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
  jwt,
  userId,
  todolistId,
  todolist,
  setTodolist,
  setShowInput
) => {
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
    .catch((error) => console.error(error.response.request));
};
