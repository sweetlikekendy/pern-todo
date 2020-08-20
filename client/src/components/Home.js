import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import axios from "axios";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import Todolists from "./Todolists";
import { Todolist, addTodolist } from "./Todolist";
import { TODOLISTS_URI, TODOS_URI } from "../endpoints";

const Home = ({
  numOfTodolists,
  firstName,
  userId,
  isLoggedIn,
  jwt,
  todolists,
  setTodolists,
  setNumOfTodolists,
  fetching,
  setFetching,
  reordering,
  setReordering,
  persistedData,
  setPersistedData,
}) => {
  const [newTodolist, setNewTodolist] = useState("");

  const fetchData = async () => {
    // old working stuff
    await axios
      .get(TODOLISTS_URI(userId), {
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
            axios.get(TODOS_URI(userId, todolists[i].id), {
              headers: {
                Authorization: jwt,
              },
            })
          );
        }

        // Execute the array of promises
        await Promise.all(promises)
          .then(async (results) => {
            const todolistsWithTodos = [];
            await results.map(({ data }, i) => {
              const { todos, numOfTodos } = data;

              // if there are no todos, save the todos as an element as an empty array in a new object
              if (numOfTodos === 0) {
                const todolistNoTodos = {
                  todolist: todolists[i],
                  todos: [],
                  numOfTodos,
                };
                todolistsWithTodos.push(todolistNoTodos);
              } else {
                // if there are todos, save the todos as an element as an array in a new object
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

    // new stuff with react beautiful dnd and state
    await axios
      .get(TODOLISTS_URI(userId), {
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
            axios.get(TODOS_URI(userId, todolists[i].id), {
              headers: {
                Authorization: jwt,
              },
            })
          );
        }

        // Execute the array of promises
        await Promise.all(promises)
          .then(async (results) => {
            const tmpData = { todos: {}, todolists: {}, todolistOrder: [] };
            const todolistsWithTodos = {};
            const tmpTodos = [];
            await results.map(({ data }, i) => {
              const { todos, numOfTodos } = data;

              // Create an array with all the todos in there
              todos.map((todo) => {
                tmpTodos.push(todo);
              });

              if (numOfTodos === 0) {
                // const todolistNoTodos = {
                //   todolist: todolists[i],
                //   todos: [],
                //   numOfTodos,
                // };
                // todolistsWithTodos[`todolist-${i}`] = todolistNoTodos;
              } else {
                // if there are todos, save the todos as a property as an array in a new object
                // const todolistWithTodos = {
                //   todolist: todolists[i],
                //   todos,
                //   numOfTodos,
                // };
                // todolistsWithTodos[`todolist-${i}`] = todolistWithTodos;
              }
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
                tmpData.todos[`todo-${normalizedIndex}`] = {
                  isEmpty: true,
                  id,
                  todolistId: todolist_id,
                  todolistTitle: title,
                  content: description,
                  createdAt: created_at,
                  updatedAt: updated_at,
                  firstName: first_name,
                  lastName: last_name,
                };
              } else {
                tmpData.todos[`todo-${normalizedIndex}`] = {
                  isEmpty: false,
                  id,
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
                userId: user_id,
                title,
                createdAt: created_at,
                updatedAt: updated_at,
                firstName: first_name,
                lastName: last_name,
              };
              tmpData.todolistOrder.push(`todolist-${normalizedIndex}`);
            });
            setPersistedData(tmpData);
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

  const onDragEnd = (result) => {
    // TODO reorder our lists
    const { destination, source, draggableId } = result;

    // No destination
    if (!destination) return;

    // If dropped in the same place started
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;
  };

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
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todolists-droppable" type="TODOLISTS">
          {(provided, snapshot) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Todolists
                todolists={todolists}
                jwt={jwt}
                userId={userId}
                setFetching={setFetching}
                reordering={reordering}
                setReordering={setReordering}
                fetchData={fetchData}
              />
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  ) : (
    <div>
      Not logged in. Click <Link to="/login">here</Link> to login
    </div>
  );
};

Home.propTypes = {};

export default Home;
