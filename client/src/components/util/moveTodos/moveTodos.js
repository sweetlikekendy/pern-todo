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
export const moveTodos = (
  jwt,
  userId,
  stateData,
  source,
  destination,
  draggableId
) => {
  // Get todolist data being dragged
  const todolist = stateData.todolists[source.droppableId];
  // Copy the todo order array
  const newTodoIds = Array.from(todolist.todoIds);

  removeAndInsertArrayElement(
    newTodoIds,
    source.index,
    destination.index,
    draggableId
  );

  // Add the new todo order to the current todolist object
  const newTodolist = {
    ...todolist,
    todoIds: newTodoIds,
  };

  // Add the new todolist with it's new todo order to a new state data object
  const newStateData = {
    ...stateData,
    todolists: {
      ...stateData.todolists,
      [newTodolist.dndId]: newTodolist,
    },
  };

  /*
    get the original todoIds for order
    the todoId order for the put request will be the same as the original order
    Example is for moving todo-9 to end of the todos array
    EX. todo-9, todo-8, todo-7, todo-6 ids => {id: 9},{id:  8}, {id: 7}, {id: 6}
    The after the swap you want the new todoIds, but their data only.
    EX. {...todo-8 data}, {...todo-7 data}, {...todo-6 data}, {...todo-9 data}
    put request will be the ids of original array with new swapped data
    EX.
    {id: 9, ...todo-8 data}, {id:  8, ...todo-7 data},
    { id: 7, ...todo - 6 data }, { id: 6, ...todo - 9 data }
  */

  // get the original todos order
  const originalTodoIds = Array.from(todolist.todoIds);
  // get the new todos order
  const copyTodoIds = Array.from(newTodoIds);

  // Get the todo ids that have shifted after moving the todo
  // ShiftedTodoIds array to keep track of which todo ids have shifted
  // OldTodoIds array to keep track of original order of todo ids
  let [shiftedTodoIds, oldTodoIds] = getShiftedIds(
    copyTodoIds,
    originalTodoIds,
    source.index,
    destination.index
  );

  // Convert todo objects into an array
  const todosAsArray = Object.entries(newStateData.todos);
  const newTodos = findMatchingElementsInArrays(oldTodoIds, todosAsArray);

  const copyNewTodos = Array.from(newTodos);

  //  Get the matching todos with the shifted todos
  shiftedTodoIds.forEach((todo, i) => {
    todosAsArray.forEach((element, j) => {
      if (todosAsArray[j][0].includes(todo)) {
        copyNewTodos[i] = {
          ...copyNewTodos[i],
          content: todosAsArray[j][1].content,
          createdAt: todosAsArray[j][1].createdAt,
          firstName: todosAsArray[j][1].firstName,
          lastName: todosAsArray[j][1].lastName,
          todolistId: todosAsArray[j][1].todolistId,
          todolistTitle: todosAsArray[j][1].todolistTitle,
          updatedAt: todosAsArray[j][1].updatedAt,
        };
      }
    });
  });

  const promises = [];

  copyNewTodos.forEach((todo) => {
    const { todolistId, id, content } = todo;
    promises.push(
      axios.put(
        SINGLE_TODO_URI(userId, todolistId, id),
        { description: content },
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
