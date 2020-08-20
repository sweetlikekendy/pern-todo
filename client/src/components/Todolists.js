import React from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";
import { Todolist, addTodolist } from "./Todolist";

const Todolists = ({
  todolists,
  jwt,
  userId,
  setFetching,
  reordering,
  setReordering,
  fetchData,
}) => {
  return (
    <ul>
      {todolists.map(({ todolist, todos }, i) => (
        <Draggable draggableId={`draggable-${todolist.id}`} index={i}>
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              <Todolist
                key={todolist.id}
                index={i}
                todolists={todolists}
                todolist={todolist}
                todos={todos}
                jwt={jwt}
                userId={userId}
                todolistId={todolist.id}
                todolistTitle={todolist.title}
                setFetching={setFetching}
                reordering={reordering}
                setReordering={setReordering}
                fetchData={fetchData}
              />
            </div>
          )}
        </Draggable>
      ))}
    </ul>
  );
};

Todolists.propTypes = {};

export default Todolists;
