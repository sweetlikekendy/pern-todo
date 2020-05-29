import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import axios from "axios";

const Home = ({
  numOfTodolists,
  numOfTodos,
  firstName,
  isLoggedIn,
  jwt,
  todolists,
  todos,
  setTodolists,
  setTodos,
  setNumOfTodolists,
  setNumOfTodos,
}) => {
  const user_id = 1;
  const todolist_id = 2;
  const todo_id = 5;
  const GET_ALL_TODOLISTS_URI =
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${user_id}/todolists`;
  const GET_SINGLE_TODOLIST_URI =
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${user_id}/todolists/${todolist_id}`;
  const GET_ALL_TODOS_URI =
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${user_id}/todolists/${todolist_id}/todos`;
  const GET_SINGLE_TODO_URI =
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${user_id}/todolists/${todolist_id}/todos/${todo_id}`;
  useEffect(() => {
    axios
      .get(GET_ALL_TODOLISTS_URI, {
        headers: {
          Authorization: jwt,
        },
      })
      .then((response) => {
        console.log(`all todolists`, response.data);
        const { data } = response;
        const { todolists } = data;

        setTodolists(todolists);
        setNumOfTodolists(todolists.length);
      })
      .catch((error) => console.error(error));

    axios
      .get(GET_SINGLE_TODOLIST_URI, {
        headers: {
          Authorization: jwt,
        },
      })
      .then((response) => {
        console.log(`single todolist`, response.data);
      })
      .catch((error) => console.error(error));

    axios
      .get(GET_ALL_TODOS_URI, {
        headers: {
          Authorization: jwt,
        },
      })
      .then((response) => {
        console.log(`all todos`, response.data);
        const { data } = response;
        const { todos } = data;
        setTodos(todos);
        setNumOfTodos(todos.length);
      })
      .catch((error) => console.error(error));

    axios
      .get(GET_SINGLE_TODO_URI, {
        headers: {
          Authorization: jwt,
        },
      })
      .then((response) => console.log(`single todo`, response.data))
      .catch((error) => console.error(error));
  }, []);
  return isLoggedIn ? (
    <div>
      <div>
        <h2>Hello, {firstName}</h2>
        <p>
          You have {numOfTodolists}
          {numOfTodolists === 1 ? (
            <span> todolist</span>
          ) : (
            <span> todolists</span>
          )}
        </p>
      </div>
      <div>
        <ul>
          {todolists.map((todolist) => (
            <li>
              {todolist.title} | {numOfTodos} todos
            </li>
          ))}
          <ul>
            {todos.map((todo) => (
              <li>{todo.description}</li>
            ))}
          </ul>
        </ul>
      </div>
    </div>
  ) : (
    <div>
      Not logged in. Click <Link to="/login">here</Link> to login
    </div>
  );
};

Home.propTypes = {};

export default Home;
