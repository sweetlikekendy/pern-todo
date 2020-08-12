import React, { useState } from "react";
import PropTypes from "prop-types";
import { Todo } from "../Todo";
import {
  SINGLE_TODOLIST_URI,
  TODOS_URI,
  SINGLE_TODO_URI,
} from "../../endpoints";

import { deleteTodolist, editTodolist } from "./crud";
import { addTodo } from "../Todo";

const Todolist = ({
  index,
  todolist,
  todos,
  jwt,
  userId,
  todolistId,
  todolistTitle,
  setFetching,
  moveItemUp,
  moveItemDown,
}) => {
  const [newTodo, setNewTodo] = useState("");
  const [newTodolist, setNewTodolist] = useState(todolistTitle);
  const [showInput, setShowInput] = useState(false);
  const buttonStyle = { padding: "8px", margin: "8px" };

  const showEditTodolist = () => {
    setShowInput(true);
  };

  return (
    <li>
      <button
        style={buttonStyle}
        onClick={() => {
          moveItemUp(index);
        }}
      >
        Up
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          moveItemDown(index);
        }}
      >
        Down
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          setFetching(true);
          deleteTodolist(jwt, userId, todolistId);
        }}
      >
        X
      </button>
      {todolist.title}{" "}
      {showInput ? (
        <label>
          <input
            type="text"
            name="todo"
            value={newTodolist}
            onChange={(e) => {
              if (newTodolist) {
                setFetching(true);
                setNewTodolist(e.target.value);
              }
            }}
          />
        </label>
      ) : (
        ""
      )}
      {showInput ? (
        <button
          style={buttonStyle}
          onClick={() => {
            setFetching(true);
            editTodolist(
              jwt,
              userId,
              todolistId,
              newTodolist,
              setNewTodolist,
              setShowInput
            );
          }}
        >
          Submit
        </button>
      ) : (
        <button style={buttonStyle} onClick={() => showEditTodolist()}>
          Edit Title
        </button>
      )}{" "}
      | {todos.length} todos
      <br />
      <label>
        <input
          type="text"
          name="todo"
          value={newTodo}
          placeholder="Enter todo here"
          onChange={(e) => setNewTodo(e.target.value)}
        />
      </label>
      <button
        style={buttonStyle}
        onClick={() => {
          if (newTodo) {
            setFetching(true);
            addTodo(jwt, userId, todolistId, newTodo, setNewTodo);
          }
        }}
      >
        Add new todo
      </button>
      <ul>
        {todos.map((todo, i) => {
          return (
            todo.length !== 0 && (
              <Todo
                jwt={jwt}
                userId={userId}
                todolistId={todolistId}
                todoId={todo.id}
                description={todo.description}
                setFetching={setFetching}
                key={todo.id}
              />
            )
          );
        })}
      </ul>
    </li>
  );
};

Todolist.propTypes = {};

export default Todolist;
