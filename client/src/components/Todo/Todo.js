import React, { useState } from "react";
import PropTypes from "prop-types";
import { Draggable } from "react-beautiful-dnd";

import { deleteTodo, editTodo } from "./";
import {
  Button,
  Input,
  JustifyCenterContainer,
  TodoContainer,
} from "../../styles";

// const Container = styled.div`
//   display: flex;
//   padding: 1rem;
//   /* border: 2px solid lightgray; */
//   /* border-top: 2px solid lightgrey; */
//   /* border-bottom: 2px solid lightgrey; */
//   border-radius: 2px;
//   margin-bottom: 8px;
//   background-color: ${(props) => (props.isDragging ? "lightgreen" : "white")};
// `;

const Todo = ({ index, userId, todolistId, todo, jwt, setFetching }) => {
  const { id: todoId, dndId, content } = todo;
  const [newTodo, setNewTodo] = useState(content);

  console.log(newTodo);

  const editTodoOnKeyPress = (event) => {
    const { key } = event;

    if (key === "Enter") {
      editTodo(jwt, userId, todolistId, todoId, newTodo);
      setFetching(true);
    }
  };

  return (
    <Draggable draggableId={dndId} index={index}>
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
          {/* <p>{todo.content}</p> */}
          <label htmlFor={dndId}>
            <Input
              id={dndId}
              type="text"
              name="todo"
              value={newTodo}
              // updateInputValue={setNewTodo}
              // onEnterPress={editTodoOnKeyPress}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => editTodoOnKeyPress(e)}
              isTodoInput
              userId={userId}
              todolistId={todolistId}
              jwt={jwt}
              todoId={todoId}
              content={todo.content}
              setFetching={setFetching}
            />
          </label>
        </TodoContainer>
      )}
    </Draggable>
  );
};

Todo.propTypes = {};

export default Todo;
