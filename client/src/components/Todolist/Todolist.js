import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { Todo } from "../Todo";
import {
  SINGLE_TODOLIST_URI,
  TODOS_URI,
  SINGLE_TODO_URI,
} from "../../endpoints";

import { deleteTodolist, editTodolist } from "./crud";

const Todolist = ({
  todolist,
  todos,
  jwt,
  userId,
  todolistId,
  todolistTitle,
}) => {
  const [inputTodo, setInputTodo] = useState("");
  const [newTodolist, setNewTodolist] = useState(todolistTitle);
  const [showInput, setShowInput] = useState(false);

  const addTodo = (event, todolistId) => {
    event.preventDefault();
    axios
      .post(
        TODOS_URI(userId, todolistId),
        { description: inputTodo },
        {
          headers: {
            Authorization: jwt,
          },
        }
      )
      .then((response) => {
        console.log(response);
        setInputTodo("");
      })
      .catch((error) => console.error(error));
  };

  const showEditTodolist = (event) => {
    event.preventDefault();
    setShowInput(true);
  };

  return (
    <li>
      <button onClick={(e) => deleteTodolist(e, jwt, userId, todolistId)}>
        X
      </button>
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
        <button onClick={(e) => showEditTodolist(e, todolistId)}>
          Edit Title
        </button>
      )}{" "}
      | {todos.length} todos |{" "}
      <label>
        <input
          type="text"
          name="todo"
          value={inputTodo}
          placeholder="Enter todo here"
          onChange={(e) => setInputTodo(e.target.value)}
        />
      </label>
      <button onClick={(e) => addTodo(e, todolistId)}>Add new todo</button>
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
