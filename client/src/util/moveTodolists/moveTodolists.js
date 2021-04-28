import axios from "axios";
import { SINGLE_TODOLIST_URI, SINGLE_TODO_URI } from "../../endpoints";
import { removeAndInsertArrayElement } from "..";

/**
 * Move todolists with or without todos in it
 * First get the todolist being moved, then remove it from the todolistOrder array
 * Insert the todolist in it's new place and then set the new order of todolistOrder array
 * Set new todolistOrder array to the state object
 * With the new state data, send axios put requests to change the todolists in the backend
 * @param {string} jwt JWT to authorize request
 * @param {object} stateData User's todolists data
 * @param {object} source Source object on drag given by react-beautiful-dnd
 * @param {object} destination Destination object on drag given by react-beautiful-dnd
 * @param {string} draggableId Id of the todolist being dragged
 * @return {object} Asynchronously resolved Promise of Promise.all
 */
export const moveTodolists = (jwt, stateData, source, destination, draggableId) => {
  const { data } = stateData;
  const { todolists } = data;

  // create a copy of the todolists
  const copyTodolists = Array.from(todolists);

  // get the data of the todolist being moved
  const todolistBeingMoved = todolists.find((todolist) => {
    if (todolist.dndId === draggableId) {
      return todolist.dndId === draggableId;
    }
  });

  // get the data of all todolists after the todolistBeingMoved has been moved
  removeAndInsertArrayElement(copyTodolists, source.index, destination.index, todolistBeingMoved);

  // apply the data to the original ordered todolist ids
  const finalTodolists = [];

  // only get the todos that are being moved in the final todos
  for (let i = source.index; i <= destination.index; i++) {
    finalTodolists.push({
      ...copyTodolists[i],
      id: todolists[i].id,
    });
  }

  const promises = [];

  finalTodolists.forEach((todolist) => {
    const { user_id: userId, id, title, todos } = todolist;

    // put requests for empty todolists
    promises.push(
      axios.put(
        SINGLE_TODOLIST_URI(userId, id),
        { title },
        {
          headers: {
            Authorization: jwt,
          },
        }
      )
    );

    // put request for todolists with todos
    if (todolist.todos.length !== 0) {
      todos.forEach((todo) => {
        promises.push(
          axios.put(
            SINGLE_TODO_URI(userId, id, todo.id),
            {
              description: todo.description,
              newTodolistId: id,
            },
            {
              headers: {
                Authorization: jwt,
              },
            }
          )
        );
      });
    }
  });

  // Execute the array of promises
  return Promise.all(promises)
    .then((results) => {
      console.log(results);
    })
    .catch((error) => console.error(error.response.request));

  // if one is empty, change the todolist IDs in the todos to the new one
  // if both have todos, change both todolist ids for the todos in the the todolists
};
