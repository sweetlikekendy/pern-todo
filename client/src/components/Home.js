import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import axios from "axios";

import { Todolist, addTodolist } from "./Todolist";
import { TODOLISTS_URI, TODOS_URI } from "../endpoints";

const Home = ({
  numOfTodolists,
  firstName,
  userId,
  isLoggedIn,
  jwt,
  persistedTodolists,
  setPersistedTodolists,
  todolists,
  setTodolists,
  setNumOfTodolists,
  fetching,
  setFetching,
  moveItemUp,
  moveItemDown,
  reordering,
  setReordering,
  moveUp,
  setMoveUp,
  moveDown,
  setMoveDown,
}) => {
  const [newTodolist, setNewTodolist] = useState("");

  const fetchData = async () => {
    if (fetching) {
      const data = await axios
        .get(TODOLISTS_URI(userId), {
          headers: {
            Authorization: jwt,
          },
        })
        .then(async (response) => {
          const { data } = response;
          const { todolists } = data;
          const promises = [];

          for (let i = 0; i < todolists.length; i++) {
            promises.push(
              axios.get(TODOS_URI(userId, todolists[i].id), {
                headers: {
                  Authorization: jwt,
                },
              })
            );
          }

          return await Promise.all(promises)
            .then(async (results) => {
              const todolistsWithTodos = [];
              await results.map(({ data }, i) => {
                const { todos, numOfTodos } = data;
                // if there are no todos, save the todos as a property as an empty array in a new object
                if (numOfTodos === 0) {
                  const todolistNoTodos = {
                    todolist: todolists[i],
                    todos: [],
                    numOfTodos,
                  };
                  todolistsWithTodos.push(todolistNoTodos);
                } else {
                  // if there are todos, save the todos as a property as an array in a new object
                  const todolistWithTodos = {
                    todolist: todolists[i],
                    todos,
                    numOfTodos,
                  };
                  todolistsWithTodos.push(todolistWithTodos);
                }
              });
              setTodolists(todolistsWithTodos);
              setNumOfTodolists(todolists.length);
            })
            .catch((error) => console.error(error));
        })
        .catch((error) => console.error(error));

      return data;
    }
  };

  const reorderData = async () => {
    if (reordering) {
      if (moveUp) {
        setMoveUp(false);
      }
      if (moveDown) {
        setMoveDown(false);
      }
    }
  };

  useEffect(() => {
    if (fetching) {
      fetchData();
      setFetching(false);
    }
    if (reordering) {
      reorderData();
      setReordering(false);
    }
  }, [fetching, reordering]);

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
            value={newTodolist}
            placeholder="Enter todolist title here"
            onChange={(e) => setNewTodolist(e.target.value)}
          />
        </label>
        <button
          onClick={() => {
            if (newTodolist) {
              setFetching(true);
              addTodolist(jwt, userId, newTodolist, setNewTodolist);
            }
          }}
        >
          Add new todolist
        </button>
      </div>
      <div>
        <ul>
          {todolists.map(({ todolist, todos }, i) => (
            <Todolist
              index={i}
              todolist={todolist}
              todos={todos}
              jwt={jwt}
              userId={userId}
              todolistId={todolist.id}
              todolistTitle={todolist.title}
              setFetching={setFetching}
              key={todolist.id}
              moveItemUp={moveItemUp}
              moveItemDown={moveItemDown}
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
