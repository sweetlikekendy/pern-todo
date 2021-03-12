import axios from "axios";
import { SINGLE_TODO_URI } from "../../../endpoints";
import { removeAndInsertArrayElement } from "..";
import { getShiftedIds, findMatchingElementsInArrays } from "../util";

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
  console.log(stateData, "stateData");
  const { data } = stateData;
  const { todolists } = data;

  // Get todolist data that the todo is in
  const list = todolists.find((todolists, i) => {
    if (todolists.todolist.dndId === source.droppableId) {
      return todolists.todolist.dndId === source.droppableId;
    }
  });

  const { todolist, todos } = list;

  console.log(todolist);

  console.log(`todolist name: ${todolist.title}`);

  const copyTodos = Array.from(todos);

  console.log(`todos in todolist name ${todolist.title}`, copyTodos);

  const todoMoved = todos.find((todos, i) => {
    if (todos.dndId === draggableId) {
      return todos.dndId === draggableId;
    }
  });

  removeAndInsertArrayElement(copyTodos, source.index, destination.index, todoMoved);
  // console.log(copyTodos);

  const finalTodos = copyTodos.map((todo, i) => {
    return {
      ...todo,
      id: todos[i].id,
    };
  });

  console.log(`finalTodos that will sent as a post request`, finalTodos);

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
