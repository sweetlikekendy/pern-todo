import React, { useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";

import { deleteTodo, editTodo } from "./";
import {
  Button,
  Input,
  JustifyCenterContainer,
  TodoContainer,
} from "../../styles";

const Container = styled.div`
  display: flex;
  padding: 1rem;
  /* border: 2px solid lightgray; */
  /* border-top: 2px solid lightgrey; */
  /* border-bottom: 2px solid lightgrey; */
  border-radius: 2px;
  margin-bottom: 8px;
  background-color: ${(props) => (props.isDragging ? "lightgreen" : "white")};
`;

const Todo = ({ index, userId, todolistId, todo, jwt, setFetching }) => {
  const [newTodo, setNewTodo] = useState(todo.content);
  const todoId = todo.id;

  const editTodoOnKeyPress = (event) => {
    const { key } = event;

    if (key === "Enter") {
      editTodo(jwt, userId, todolistId, todoId, newTodo);
      setFetching(true);
    }
  };

  return (
    <Draggable draggableId={todo.dndId} index={index}>
      {(provided, snapshot) => (
        <TodoContainer
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          <Button
            isClose
            onClick={() => {
              deleteTodo(jwt, userId, todolistId, todoId);
              setFetching(true);
            }}
          >
            X
          </Button>
          <Input
            type="text"
            name="todo"
            value={newTodo}
            // updateInputValue={setNewTodo}
            // onEnterPress={editTodoOnKeyPress}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => editTodoOnKeyPress(e)}
          />
        </TodoContainer>
      )}
    </Draggable>
  );
};

Todo.propTypes = {};

export default Todo;
