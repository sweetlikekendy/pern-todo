import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { DragDropContext } from "react-beautiful-dnd";

import { Todolist } from "./Todolist";
import { SINGLE_TODO_URI } from "../endpoints";

const Todolists = ({
  todolistOrder,
  todolists,
  todos,
  stateData,
  setStateData,
  jwt,
  userId,
  setFetching,
  reordering,
  setReordering,
  fetchData,
}) => {
  const onDragEnd = async (result) => {
    // TODO reorder our lists
    const { destination, source, draggableId } = result;

    // No destination
    if (!destination) return;

    // If dropped in the same place started
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const todolist = todolists[source.droppableId];
    const newTodoIds = Array.from(todolist.todoIds);

    console.log("source index", source.index);
    console.log("destination index", destination.index);

    newTodoIds.splice(source.index, 1);
    newTodoIds.splice(destination.index, 0, draggableId);

    const newTodolist = {
      ...todolist,
      todoIds: newTodoIds,
    };

    const newStateData = {
      ...stateData,
      todolists: {
        ...stateData.todolists,
        [newTodolist.dndId]: newTodolist,
      },
    };

    // get the original todoIds for order
    // the todoId order for the put request will be the same as the original order
    // EX. todo-9, todo-8, todo-7, todo-6 ids
    // The after the swap you want the new todoIds, but their data only.
    // EX. todo-8 todo-7 todo-6 todo-9 data
    // put request will be the ids of original array with new swapped data
    // EX
    // | todo-9, todo-8, todo-7, todo-6 ids
    // | todo-8 todo-7 todo-6 todo-9 data
    const originalTodoIds = Array.from(todolist.todoIds);
    const copyTodoIds = Array.from(newTodoIds);
    const difference = Math.abs(source.index - destination.index);

    // The todo ids of all the todos that shifted after the move
    const shiftedTodoIds = copyTodoIds.splice(source.index, difference + 1);
    console.log("todoIds that have been shifted", shiftedTodoIds);

    // Convert todo objects into an array
    const todosAsArray = Object.entries(newStateData.todos);
    console.log("todos as array", todosAsArray);
    const newTodos = [];

    // Get the matching todos with the shifted todos
    shiftedTodoIds.forEach((todo, i) => {
      todosAsArray.forEach((element, j) => {
        if (todosAsArray[j][0].includes(todo)) {
          newTodos.push(todosAsArray[j][1]);
        }
      });
    });
    console.log(newTodos);

    const promises = [];

    newTodos.forEach((todo) => {
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
    await Promise.all(promises)
      .then((results) => {
        console.log(results);
      })
      .catch((error) => console.error(error.response.request));

    setStateData(newStateData);
    // setFetching(true);
    // console.log(newStateData);
  };
  return (
    <div>
      <DragDropContext onDragEnd={onDragEnd}>
        {todolistOrder === undefined ? (
          <div>Loading ... </div>
        ) : (
          todolistOrder.map((todolistId) => {
            const todolist = todolists[todolistId];
            const tmpTodos = todolist.todoIds.map((todoId) => todos[todoId]);

            return (
              <Todolist
                key={todolist.id}
                jwt={jwt}
                todolist={todolist}
                todos={tmpTodos}
                setFetching={setFetching}
              >
                {todolist.title}
              </Todolist>
            );
          })
        )}
      </DragDropContext>
    </div>
  );
};

Todolists.propTypes = {};

export default Todolists;
