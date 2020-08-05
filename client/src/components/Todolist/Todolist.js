import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Todo } from "../Todo";

const Todolist = ({ todolist, todos, todosUri, jwt, userId }) => {
  const [inputTodo, setInputTodo] = useState("");

  const addTodo = (event, todolistId) => {
    event.preventDefault();
    axios
      .post(
        todosUri(userId, todolistId),
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

  return (
    <li>
      {todolist.title} | {todos.length} todos |{" "}
      <label>
        <input
          type="text"
          name="todo"
          value={inputTodo}
          placeholder="Enter todo here"
          onChange={(e) => setInputTodo(e.target.value)}
        />
      </label>
      <button onClick={(e) => addTodo(e, todolist.id)}>Add new todo</button>
      <ul>
        {todos.map((todo) => (
          <Todo key={todo.id} description={todo.description} />
        ))}
      </ul>
    </li>
  );
};

Todolist.propTypes = {};

export default Todolist;
