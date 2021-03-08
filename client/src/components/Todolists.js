import React from "react";
import PropTypes from "prop-types";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

import { Todolist } from "./Todolist";
import { moveTodolists, moveTodos } from "./util";
import { FlexBoxWrap, JustifyCenterContainer } from "../styles";

const Todolists = ({
  todolistOrder,
  todolists,
  todos,
  stateData,
  jwt,
  userId,
  setFetching,
}) => {
  const onDragEnd = async (result) => {
    const { destination, source, draggableId, type } = result;

    // No destination
    if (!destination) {
      return;
    }

    // If dropped in the same place started
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // Moving todolists
    if (type === "todolist") {
      await moveTodolists(jwt, stateData, source, destination, draggableId);
      setFetching(true);
    }

    // Moving todos
    if (type === "todo") {
      await moveTodos(jwt, userId, stateData, source, destination, draggableId);
      setFetching(true);
    }
  };
  return (
    <JustifyCenterContainer>
      <DragDropContext onDragEnd={onDragEnd}>
        {todolistOrder === undefined ? (
          <div>Loading ... </div>
        ) : (
          <Droppable
            droppableId="all-todolists"
            direction="horizontal"
            type="todolist"
          >
            {(provided) => (
              <FlexBoxWrap {...provided.droppableProps} ref={provided.innerRef}>
                {todolistOrder.map((todolistId, i) => {
                  const todolist = todolists[todolistId];
                  const tmpTodos = todolist.todoIds.map(
                    (todoId) => todos[todoId]
                  );

                  return (
                    <Todolist
                      key={todolist.id}
                      index={i}
                      jwt={jwt}
                      todolist={todolist}
                      todos={tmpTodos}
                      setFetching={setFetching}
                    />
                  );
                })}
                {provided.placeholder}
              </FlexBoxWrap>
            )}
          </Droppable>
        )}
      </DragDropContext>
    </JustifyCenterContainer>
  );
};

Todolists.propTypes = {};

export default Todolists;
