import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link, navigate } from "@reach/router";
import axios from "axios";

import { Todolist, addTodolist } from "./Todolist";
import { TODOLISTS_URI, TODOS_URI } from "../endpoints";

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
  const [inputTitle, setInputTitle] = useState("");

  useEffect(() => {
    axios
      .get(TODOLISTS_URI(userId), {
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
              .get(TODOS_URI(userId, todolists[i].id), {
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
              .catch((error) => console.error(error))
          );
        }
        Promise.all(promises)
          .then(() => {
            setTodolists(todolistsWithTodos);
            setNumOfTodolists(todolists.length);
          })
          .catch((error) => console.error(error));
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
        <label>
          <input
            type="text"
            name="title"
            value={inputTitle}
            placeholder="Enter todolist title here"
            onChange={(e) => setInputTitle(e.target.value)}
          />
        </label>
        <button
          onClick={(e) =>
            addTodolist(e, jwt, userId, inputTitle, setInputTitle)
          }
        >
          Add new todolist
        </button>
      </div>
      <div>
        <ul>
          {todolists.map(({ todolist, todos }) => (
            <Todolist
              todolist={todolist}
              todos={todos}
              jwt={jwt}
              userId={userId}
              todolistId={todolist.id}
              todolistTitle={todolist.title}
              key={todolist.id}
            />
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
