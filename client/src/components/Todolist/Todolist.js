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
  setFetching,
}) => {
  const [newTodo, setNewTodo] = useState("");
  const [newTodolist, setNewTodolist] = useState(todolistTitle);
  const [showInput, setShowInput] = useState(false);

  const showEditTodolist = () => {
    setShowInput(true);
  };

  return (
    <li>
      <button
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
        <button onClick={() => showEditTodolist()}>Edit Title</button>
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
