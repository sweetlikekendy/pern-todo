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

    const cpyTodoIds = Array.from(todolist.todoIds);
    const todoIdOne = cpyTodoIds[source.index];
    const todoIdTwo = cpyTodoIds[destination.index];

    // const stringIdOne = todoIdOne[0];
    // const stringIdTwo = todoIdTwo[0];

    console.log(
      `todo id source: ${todoIdOne} ||| todo id destination: ${todoIdTwo}`
    );
    console.log(
      `todo source data, todo destination data`,
      todos[todoIdOne],
      todos[todoIdTwo]
    );

    // Assign the two swapped todos to their own variables
    const todoOne = todos[todoIdOne];
    const todoTwo = todos[todoIdTwo];
    const todolistId = todolist.id;

    console.log("todo 1, todo 2", todoOne, todoTwo);
    await axios
      .put(
        SINGLE_TODO_URI(userId, todolistId, todoOne.id),
        { description: todoTwo.content },
        {
          headers: {
            Authorization: jwt,
          },
        }
      )
      .then((response) => {
        console.log(response);
      })
      .catch((error) => console.error(error));
    // await axios
    //   .put(
    //     SINGLE_TODO_URI(userId, todolistId, todoTwo.id),
    //     { description: todoOne.content },
    //     {
    //       headers: {
    //         Authorization: jwt,
    //       },
    //     }
    //   )
    //   .then((response) => {
    //     console.log(response);
    //   })
    //   .catch((error) => console.error(error));

    setFetching(true);
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
