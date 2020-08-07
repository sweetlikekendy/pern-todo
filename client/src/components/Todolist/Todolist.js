import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "@reach/router";

import { Todo } from "../Todo";
import {
  SINGLE_TODOLIST_URI,
  TODOS_URI,
  SINGLE_TODO_URI,
} from "../../endpoints";

import { deleteTodolist, editTodolist } from "./crud";
import { addTodo } from "../Todo";

const Todolist = ({
  todolist,
  todos,
  jwt,
  userId,
  todolistId,
  todolistTitle,
  navigate,
}) => {
  const [inputTodo, setInputTodo] = useState("");
  const [newTodolist, setNewTodolist] = useState(todolistTitle);
  const [showInput, setShowInput] = useState(false);
  const [isIdle, setIsIdle] = useState(true);
  const [isFetching, setIsFetching] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFailure, setIsFailure] = useState(false);

  const showEditTodolist = (event) => {
    event.preventDefault();
    setShowInput(true);
  };

  if (isSuccess) {
    return <Redirect to="/" noThrow />;
  }

  return (
    <li>
      <button onClick={() => deleteTodolist(jwt, userId, todolistId)}>X</button>
      {todolist.title}{" "}
      {showInput ? (
        <label>
          <input
            type="text"
            name="todo"
            value={newTodolist}
            onChange={(e) => setNewTodolist(e.target.value)}
          />
        </label>
      ) : (
        ""
      )}
      {showInput ? (
        <button
          onClick={(e) =>
            editTodolist(
              e,
              jwt,
              userId,
              todolistId,
              newTodolist,
              setNewTodolist,
              setShowInput
            )
          }
        >
          Submit
        </button>
      ) : (
        <button onClick={() => showEditTodolist(todolistId)}>Edit Title</button>
      )}{" "}
      | {todos.length} todos
      <br />
      <label>
        <input
          type="text"
          name="todo"
          value={inputTodo}
          placeholder="Enter todo here"
          onChange={(e) => setInputTodo(e.target.value)}
        />
      </label>
      <button
        onClick={() => {
          addTodo(jwt, userId, todolistId, inputTodo, setInputTodo);
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
