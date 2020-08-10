import React, { useState } from "react";
import PropTypes from "prop-types";
import { deleteTodo, editTodo } from "./";

const Todo = ({
  jwt,
  userId,
  todolistId,
  todoId,
  description,
  setFetching,
}) => {
  const [newTodo, setNewTodo] = useState(description);
  const [showInput, setShowInput] = useState(false);

  const showEditTodo = (event) => {
    setShowInput(true);
  };

  return (
    <li>
      <button
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
