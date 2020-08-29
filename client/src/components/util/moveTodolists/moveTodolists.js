import axios from "axios";
import { SINGLE_TODOLIST_URI, SINGLE_TODO_URI } from "../../../endpoints";
import { removeAndInsertArrayElement } from "..";
import {
  getShiftedIds,
  selectArrayFromRange,
  findMatchingElementsInArrays,
} from "../util";
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
export const moveTodolists = (
  jwt,
  stateData,
  source,
  destination,
  draggableId
) => {
  // New todolistOrder array
  const newTodolistOrder = Array.from(stateData.todolistOrder);

  removeAndInsertArrayElement(
    newTodolistOrder,
    source.index,
    destination.index,
    draggableId
  );

  // Add the new todolistOrder a new state data object
  const newStateData = {
    ...stateData,
    todolistOrder: newTodolistOrder,
  };

  // Get original todolist order
  const originalTodolistIds = Array.from(stateData.todolistOrder);
  // Get new todolist order
  const copyTodolistIds = Array.from(newStateData.todolistOrder);

  // Get the todolist ids that have shifted after moving the todolist
  let todolistIds = getShiftedIds(
    copyTodolistIds,
    originalTodolistIds,
    source.index,
    destination.index
  );
  // empty array to keep track of which todo ids have shifted
  let shiftedTodolistIds = todolistIds[0];
  // empty array to keep track of original order of todo ids
  let oldTodolistIds = todolistIds[1];

  // Convert todolist objects into an array
  const todolistsAsArray = Object.entries(newStateData.todolists);
  const newTodolists = findMatchingElementsInArrays(
    oldTodolistIds,
    todolistsAsArray
  );

  const copyNewTodolists = Array.from(newTodolists);
  //  Get the matching todos with the shifted todos
  shiftedTodolistIds.forEach((todolist, i) => {
    todolistsAsArray.forEach((element, j) => {
      if (todolistsAsArray[j][0].includes(todolist)) {
        copyNewTodolists[i] = {
          ...copyNewTodolists[i],
          userId: todolistsAsArray[j][1].userId,
          title: todolistsAsArray[j][1].title,
          createdAt: todolistsAsArray[j][1].createdAt,
          firstName: todolistsAsArray[j][1].firstName,
          lastName: todolistsAsArray[j][1].lastName,
          todoIds: todolistsAsArray[j][1].todoIds,
          updatedAt: todolistsAsArray[j][1].updatedAt,
        };
      }
    });
  });
  const promises = [];

  // Array to hold todolists with no todos
  let emptyTodolists = [];

  // Array to hold todolists with todos
  let notEmptyTodolists = [];

  // Find todolists with/without todos and push onto 2 previously declared arrays
  for (let todolist of copyNewTodolists) {
    if (todolist.todoIds.length === 0) {
      emptyTodolists.push(todolist);
    } else {
      notEmptyTodolists.push(todolist);
    }
  }

  // If todolist with todos is empty, that means all swapped todolists are empty.
  // Swap just the titles
  if (notEmptyTodolists.length === 0) {
    copyNewTodolists.forEach((todolist) => {
      const { userId, id, title } = todolist;
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
    });
  }
  // If todolists with todos is not empty, that means some todolists have todos
  // Swap the titles and the todolist ids for the todos
  else {
    copyNewTodolists.forEach((todolist, i) => {
      const { userId, id, title, todoIds } = todolist;
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
      if (todoIds.length !== 0) {
        // Convert todo objects into an array
        const todosAsArray = Object.entries(newStateData.todos);
        const newTodos = [];

        // Get the matching todos with the shifted todos
        todoIds.forEach((todo, j) => {
          todosAsArray.forEach((_element, k) => {
            if (todosAsArray[k][0].includes(todo)) {
              newTodos.push(todosAsArray[k][1]);
            }
          });
        });
        copyNewTodolists[i] = {
          ...copyNewTodolists[i],
          todos: newTodos,
        };
        // Push axios put requests to promise array to all the todos with their new todolist ids

        if (copyNewTodolists[i].todos.length !== 0) {
          for (let j = 0; j < copyNewTodolists[i].todos.length; j++) {
            console.log(copyNewTodolists[i].todos[j]);
            promises.push(
              axios.put(
                SINGLE_TODO_URI(
                  userId,
                  copyNewTodolists[i].id,
                  copyNewTodolists[i].todos[j].id
                ),
                {
                  newTodolistId: copyNewTodolists[i].id,
                },
                {
                  headers: {
                    Authorization: jwt,
                  },
                }
              )
            );
          }
        }
      }
    });
  }

  // Execute the array of promises
  return Promise.all(promises)
    .then((results) => {
      console.log(results);
    })
    .catch((error) => console.error(error.response.request));

  // if one is empty, change the todolist IDs in the todos to the new one
  // if both have todos, change both todolist ids for the todos in the the todolists
};
