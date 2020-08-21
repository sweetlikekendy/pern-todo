import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import axios from "axios";

import Todolists from "./Todolists";
import { Todolist, addTodolist } from "./Todolist";
import { TODOLISTS_URI, TODOS_URI } from "../endpoints";

const Home = ({
  firstName,
  userId,
  stateUserId,
  isLoggedIn,
  jwt,
  fetching,
  setFetching,
  reordering,
  setReordering,
  setPersistedData,
  stateData,
  setStateData,
}) => {
  const [newTodolist, setNewTodolist] = useState("");
  const { numOfTodolists, todolistOrder, todolists, todos } = stateData;
  const fetchData = async () => {
    console.log(`fetching data`);
    console.log(stateUserId);
    // new stuff with react beautiful dnd and state
    await axios
      .get(TODOLISTS_URI(stateUserId), {
        headers: {
          Authorization: jwt,
        },
      })
      .then(async (response) => {
        const { data } = response;
        const { todolists } = data;
        const promises = [];

        // Get all the todos in a todolist
        // Push onto promises array
        for (let i = 0; i < todolists.length; i++) {
          promises.push(
            axios.get(TODOS_URI(stateUserId, todolists[i].id), {
              headers: {
                Authorization: jwt,
              },
            })
          );
        }

        // Execute the array of promises
        await Promise.all(promises)
          .then(async (results) => {
            const tmpData = {
              numOfTodolists,
              todos: {},
              todolists: {},
              todolistOrder: [],
            };
            const tmpTodos = [];
            results.map(({ data }, i) => {
              const { todos, numOfTodos } = data;

              // Create an array with all the todos in there
              todos.map((todo) => {
                tmpTodos.push(todo);
              });
            });

            tmpTodos.map((todo, i) => {
              const normalizedIndex = i + 1;
              const {
                id,
                todolist_id,
                description,
                title,
                created_at,
                updated_at,
                first_name,
                last_name,
              } = todo;
              if (todo.created_at === null) {
                return;
              }
              if (todo.created_at !== null) {
                tmpData.todos[`todo-${normalizedIndex}`] = {
                  id,
                  dndId: `todo-${normalizedIndex}`,
                  todolistId: todolist_id,
                  todolistTitle: title,
                  content: description,
                  createdAt: created_at,
                  updatedAt: updated_at,
                  firstName: first_name,
                  lastName: last_name,
                };
              }
            });
            todolists.map((todolist, i) => {
              const normalizedIndex = i + 1;
              const {
                id,
                user_id,
                title,
                created_at,
                updated_at,
                first_name,
                last_name,
              } = todolist;
              tmpData.todolists[`todolist-${normalizedIndex}`] = {
                id,
                dndId: `todolist-${normalizedIndex}`,
                userId: user_id,
                title,
                createdAt: created_at,
                updatedAt: updated_at,
                firstName: first_name,
                lastName: last_name,
                todoIds: [],
              };
              tmpData.todolistOrder.push(`todolist-${normalizedIndex}`);
            });

            const todoEntries = Object.entries(tmpData.todos);
            const todolistEntries = Object.entries(tmpData.todolists);

            // for (let i = 0; i < todolistEntries.length; i++) {
            //   console.log(todolistEntries[i]);
            //   for (let j = 0; j < todoEntries.length; j++) {
            //     console.log(todoEntries[j]);
            //     if (todoEntries[j][1].todolistId === todolistEntries[i][1].id) {
            //       console.log(
            //         "matching",
            //         todoEntries[j][1].todolistId,
            //         todolistEntries[i][1].id
            //       );
            //       console.log(todoEntries[j][0]);
            //       tmpData.todolists[`todolist-${i + 1}`].todoIds.push(
            //         todoEntries[j][0]
            //       );
            //     }
            //   }
            // }

            // Set the todos ids to their respective todolists
            todolistEntries.map((todolistEntry, i) => {
              return todoEntries.map((todoEntry, j) => {
                // if there is a match
                if (todoEntry[1].todolistId === todolistEntry[1].id) {
                  tmpData.todolists[`todolist-${i + 1}`].todoIds.push(
                    todoEntries[j][0]
                  );
                }
              });
            });
            tmpData[`numOfTodolists`] = Object.keys(tmpData.todolists).length;
            await setPersistedData(tmpData);
            await setStateData(tmpData);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    if (fetching) {
      fetchData();
      setFetching(false);
    }
  }, [fetching]);

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
      <Todolists
        todolistOrder={todolistOrder}
        todolists={todolists}
        todos={todos}
        jwt={jwt}
        userId={userId}
        setFetching={setFetching}
        reordering={reordering}
        setReordering={setReordering}
        fetchData={fetchData}
        stateData={stateData}
        setStateData={setStateData}
        setPersistedData={setPersistedData}
      />
    </div>
  ) : (
    <div>
      Not logged in. Click <Link to="/login">here</Link> to login
    </div>
  );
};

Home.propTypes = {};

export default Home;
