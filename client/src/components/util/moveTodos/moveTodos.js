import axios from "axios";
import { SINGLE_TODO_URI } from "../../../endpoints";
import { removeAndInsertArrayElement } from "..";

/**
 * Move todos within a todolist
 * First get the todo being moved, then remove it from the todoIds array
 * Insert the todo in it's new place and then set the new order of todoIds array
 * Set new todoIds array to the todolist object that you moved the todo.
 * With the new state data, send axios put requests to change the todos in the backend
 *
 * @param {string} jwt JWT to authorize request
 * @param {number} userId User's ID
 * @param {object} stateData User's todolists data
 * @param {object} source Source object on drag given by react-beautiful-dnd
 * @param {object} destination Destination object on drag given by react-beautiful-dnd
 * @param {string} draggableId Id of the todolist being dragged
 * @return {object} Asynchronously resolved Promise of Promise.all
 */
export const moveTodos = (jwt, userId, stateData, source, destination, draggableId) => {
  const { data } = stateData;
  const { todolists } = data;

  // Get todolist data that the todo is in
  const todolist = todolists.find((todolist) => {
    if (todolist.dndId === source.droppableId) {
      return todolist.dndId === source.droppableId;
    }
  });

  const { todos } = todolist;

  // create a copy of the todos
  const copyTodos = Array.from(todos);

  // get the data of the todo that is being moved
  const todoBeingMoved = todos.find((todos) => {
    if (todos.dndId === draggableId) {
      return todos.dndId === draggableId;
    }
  });

  // get the data of the todos after the todo has moved
  removeAndInsertArrayElement(copyTodos, source.index, destination.index, todoBeingMoved);

  // apply the data to the original todo ids
  const finalTodos = [];

  // only get the todos that are being moved in the final todos
  for (let i = source.index; i <= destination.index; i++) {
    finalTodos.push({
      ...copyTodos[i],
      id: todos[i].id,
    });
  }

  const promises = [];

  finalTodos.forEach((todo) => {
    const { todolist_id, id, description } = todo;
    promises.push(
      axios.put(
        SINGLE_TODO_URI(userId, todolist_id, id),
        { description },
        {
          headers: {
            Authorization: jwt,
          },
        }
      )
    );
  });

  // Execute the array of promises
  return Promise.all(promises)
    .then((results) => {
      console.log(results);
    })
    .catch((error) => console.error(error.response.request));
};
