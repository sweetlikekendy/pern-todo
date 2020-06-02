import React, { useState, useEffect, createRef } from "react";
import PropTypes from "prop-types";
import { Link, navigate } from "@reach/router";
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
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const allTodolistsUri = (userId) => {
    return process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${userId}/todolists`;
  };

  const singleTodolistUri = (userId, todolistId) => {
    return process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${userId}/todolists/${todolistId}`;
  };
  const allTodosUri = (userId, todolistId) => {
    return process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${userId}/todolists/${todolistId}/todos`;
  };
  const singleTodoUri = (userId, todolistId, todoId) => {
    return process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${userId}/todolists/${todolistId}/todos/${todoId}`;
  };
  // get all todolists api uri
  const ALL_TODOLISTS_URI =
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${user_id}/todolists`;

  // get a single todolist api uri
  const SINGLE_TODOLIST_URI =
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${user_id}/todolists/${todolist_id}`;

  // get all todos in a todolist api uri
  const ALL_TODOS_URI =
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${user_id}/todolists/${todolist_id}/todos`;

  // get a single todo in a todolist api uri
  const SINGLE_TODO_URI =
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/users/${user_id}/todolists/${todolist_id}/todos/${todo_id}`;

  useEffect(() => {
    axios
      .get(allTodolistsUri(user_id), {
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

    // axios
    //   .get(singleTodolistUri(user_id, todolist_id), {
    //     headers: {
    //       Authorization: jwt,
    //     },
    //   })
    //   .then((response) => {
    //     console.log(`single todolist`, response.data);
    //   })
    //   .catch((error) => console.error(error));

    axios
      .get(allTodosUri(user_id, todolist_id), {
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

    // axios
    //   .get(singleTodoUri(user_id, todolist_id, todo_id), {
    //     headers: {
    //       Authorization: jwt,
    //     },
    //   })
    //   .then((response) => console.log(`single todo`, response.data))
    //   .catch((error) => console.error(error));
  }, [numOfTodolists, numOfTodos]);

  // Add new todolist
  const addTodolist = (userId) => {
    axios
      .post(
        allTodolistsUri(userId),
        { title },
        {
          headers: {
            Authorization: jwt,
          },
        }
      )
      .then((response) => {
        setTitle("");
        setNumOfTodolists(todolists.length);
        navigate(`/`);

        // window.location = "/";
      })
      .catch((error) => console.error(error));
  };

  // Delete todolist
  const deleteTodolist = (todolistId) => {
    axios
      .delete(singleTodolistUri(user_id, todolistId), {
        headers: {
          Authorization: jwt,
        },
      })
      .then((_response) => {
        console.log("deleting todo");
        // window.location = "/";
        setNumOfTodolists(todolists.length);
        navigate(`/`);
      })
      .catch((error) => console.error(error));
  };

  return isLoggedIn ? (
    <div>
      <div>
        <h2>Hello, {firstName}</h2>
        <p>
          You have {numOfTodolists}
          {numOfTodolists === 0 && <span> no todolist</span>}
          {numOfTodolists === 1 ? (
            <span> todolist</span>
          ) : (
            <span> todolists</span>
          )}
        </p>
        <label>
          title
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <button onClick={() => addTodolist(user_id)}>Add new todolist</button>
      </div>
      <div>
        <ul>
          {numOfTodolists > 0 &&
            todolists.map((todolist) => (
              <li key={todolist.id}>
                {todolist.title}
                <button>Edit Todolist</button>
                <button onClick={() => deleteTodolist(todolist.id)}>
                  Delete Todolist
                </button>
                <button>Add todo</button>
                <ul>
                  {numOfTodos > 0 &&
                    todos.map(
                      (todo) =>
                        todo.todolist_id === todolist.id && (
                          <li key={todo.id}>
                            {todo.description}
                            <button>Delete todo</button>
                          </li>
                        )
                    )}
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
