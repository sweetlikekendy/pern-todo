import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styled from "@emotion/styled";
import { Draggable } from "react-beautiful-dnd";

import { deleteTodo, editTodo } from "./";

const Container = styled.div`
  padding: 8px;
  border: 2px solid lightgrey;
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? "lightgreen" : "white")};
`;

const Button = styled.button`
  padding: 8px;
  margin: 8px;
`;

const Todo = ({
  index,
  todo,
  jwt,
  userId,
  todolistId,
  todoId,
  description,
  setFetching,
}) => {
  const [newTodo, setNewTodo] = useState(description);
  const [showInput, setShowInput] = useState(false);

  const showEditTodo = () => {
    setShowInput(true);
  };

  return (
    <Draggable draggableId={todo.dndId} index={index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <Button
            onClick={() => {
              setFetching(true);
              deleteTodo(jwt, userId, todolistId, todoId);
            }}
          >
            X
          </Button>
          {todo.content}
          {showInput ? (
            <label>
              <input
                type="text"
                name="todo"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
              />
            </label>
          ) : (
            ""
          )}
          {showInput ? (
            <Button
              onClick={() => {
                if (newTodo) {
                  setFetching(true);
                  editTodo(
                    jwt,
                    userId,
                    todolistId,
                    todoId,
                    newTodo,
                    setNewTodo,
                    setShowInput
                  );
                }
              }}
            >
              Submit
            </Button>
          ) : (
            <Button
              onClick={() => {
                setFetching(true);
                showEditTodo(todolistId);
              }}
            >
              Edit Title
            </Button>
          )}{" "}
        </Container>
      )}
    </Draggable>
  );
};

Todo.propTypes = {};

export default Todo;
