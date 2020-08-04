import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Link, navigate } from "@reach/router";
import axios from "axios";

const Home = ({
  numOfTodolists,
  numOfTodos,
  firstName,
  userId,
  isLoggedIn,
  jwt,
  todolists,
  todos,
  setTodolists,
  setTodos,
  setNumOfTodolists,
  setNumOfTodos,
}) => {
  const GET_ALL_TODOLISTS_URI = (userId) =>
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${userId}/todolists`;
  // const GET_SINGLE_TODOLIST_URI = (userId, todolistId) =>
  //   process.env.NODE_ENV === `production`
  //     ? `some production uri`
  //     : `http://localhost:5000/api/users/${userId}/todolists/${todolistId}`;
  const GET_ALL_TODOS_URI = (userId, todolistId) =>
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${userId}/todolists/${todolistId}/todos`;
  // const GET_SINGLE_TODO_URI = (userId, todolistId, todoId) =>
  //   process.env.NODE_ENV === `production`
  //     ? `some production uri`
  //     : `http://localhost:5000/api/users/${userId}/todolists/${todolistId}/todos/${todoId}`;
  useEffect(() => {
    axios
      .get(GET_ALL_TODOLISTS_URI(userId), {
        headers: {
          Authorization: jwt,
        },
      })
      .then((response) => {
        const { data } = response;
        const { todolists } = data;
        let todolistsWithTodos = [];
        let promises = [];

        for (let i = 0; i < todolists.length; i++) {
          promises.push(
            axios
              .get(GET_ALL_TODOS_URI(userId, todolists[i].id), {
                headers: {
                  Authorization: jwt,
                },
              })
              .then((response) => {
                const { data } = response;
                const { todos, numOfTodos } = data;

                // if there are no todos, save the todos as a property as an empty array in a new object
                if (numOfTodos === 0) {
                  let todolistNoTodos = {
                    todolist: todolists[i],
                    todos: [],
                    numOfTodos,
                  };
                  todolistsWithTodos.push(todolistNoTodos);
                } else {
                  // if there are todos, save the todos as a property as an array in a new object
                  let todolistWithTodos = {
                    todolist: todolists[i],
                    todos,
                    numOfTodos,
                  };
                  todolistsWithTodos.push(todolistWithTodos);
                }
              })
              .catch((err) => console.error(err))
          );
        }
        Promise.all(promises)
          .then(() => {
            setTodolists(todolistsWithTodos);
            setNumOfTodolists(todolists.length);
          })
          .catch((err) => console.error(err));
      })
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
        {/* <label>
          title
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label> */}
        {/* <button onClick={() => addTodolist(user_id)}>Add new todolist</button> */}
      </div>
      <div>
        <ul>
          {todolists.map(({ todolist, todos }) => (
            <li key={todolist.id}>
              {todolist.title} | {todos.length} todos
              <ul>
                {todos.map((todo) => (
                  <li key={todo.id}>{todo.description}</li>
                ))}
              </ul>
            </li>
          ))}
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
