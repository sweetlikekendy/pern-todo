import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { deleteTodo, editTodo } from "./";

const Todo = ({
  index,
  jwt,
  todos,
  userId,
  todolistId,
  todoId,
  description,
  setFetching,
  moveTodoElementUp,
  moveTodoElementDown,
  reordering,
  setReordering,
  reorderData,
}) => {
  const [newTodo, setNewTodo] = useState(description);
  const [showInput, setShowInput] = useState(false);
  const buttonStyle = { padding: "8px", margin: "8px" };

  const showEditTodo = () => {
    setShowInput(true);
  };

  // useEffect(() => {
  //   if (reordering) {
  //     reorderData(todos);
  //     setReordering(false);
  //   }
  // }, [reordering]);

  return (
    <li>
      <button
        style={buttonStyle}
        onClick={() => {
          setReordering(true);
          moveTodoElementUp(todos, index);
        }}
      >
        Up
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          setReordering(true);
          moveTodoElementDown(todos, index);
        }}
      >
        Down
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          setFetching(true);
          deleteTodo(jwt, userId, todolistId, todoId);
        }}
      >
        X
      </button>
      {description}
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
        <button
          style={buttonStyle}
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
        </button>
      ) : (
        <button
          style={buttonStyle}
          onClick={() => {
            setFetching(true);
            showEditTodo(todolistId);
          }}
        >
          Edit Title
        </button>
      )}{" "}
    </li>
  );
};

Todo.propTypes = {};

export default Todo;
