import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Todo } from "../Todo";

import { SINGLE_TODOLIST_URI, SINGLE_TODO_URI } from "../../endpoints";

import { deleteTodolist, editTodolist } from "./crud";
import { addTodo } from "../Todo";

const Todolist = ({
  index,
  setTodolists,
  todolists,
  todolist,
  todos,
  jwt,
  userId,
  todolistId,
  todolistTitle,
  setFetching,
  reordering,
  setReordering,
}) => {
  const [newTodo, setNewTodo] = useState("");
  const [newTodolist, setNewTodolist] = useState(todolistTitle);
  const [showInput, setShowInput] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [moveDown, setMoveDown] = useState(false);

  const buttonStyle = { padding: "8px", margin: "8px" };

  const showEditTodolist = () => {
    setShowInput(true);
  };

  const swap = (array, x, y) => {
    const tmp = array[x];
    array[x] = array[y];
    array[y] = tmp;

    return array;
  };

  // Move todolist up the list
  const moveTodolistElementUp = async (array, index) => {
    const currentIndex = index;
    let aheadIndex = 0;
    const todolistsArrayCopy = array;

    console.log("up");
    console.log("todolists arr copy", todolistsArrayCopy);
    console.log("current index", currentIndex);

    // Element is at the beginning of array, can't move it forward
    if (currentIndex === 0) {
      aheadIndex = 0;
      console.log("can't move up, already at the top");
      return;
    } else {
      aheadIndex = index - 1;
      console.log("new index", aheadIndex);
      let twoElementsArray = [];

      // Slice the array to create a new array containing the two elements being swapped.
      twoElementsArray = todolistsArrayCopy.slice(aheadIndex, currentIndex + 1);

      // Es6 Swap the element before with the current element
      [twoElementsArray[0], twoElementsArray[1]] = [
        twoElementsArray[1],
        twoElementsArray[0],
      ];
      console.log("2 elements array swapped", twoElementsArray);

      const totalNumOfTodos = twoElementsArray.reduce((sum, { numOfTodos }) => {
        return sum + numOfTodos;
      }, 0);

      console.log(totalNumOfTodos);

      const {
        title: aheadTodolistTitle,
        id: aheadTodolistId,
      } = todolistsArrayCopy[aheadIndex].todolist;
      const {
        title: currentTodolistTitle,
        id: currentTodolistId,
      } = todolistsArrayCopy[currentIndex].todolist;
      const { numOfTodos: aheadNumOfTodos } = todolistsArrayCopy[aheadIndex];
      const { numOfTodos: currentNumOfTodos } = todolistsArrayCopy[
        currentIndex
      ];

      console.log(
        "ahead title, todolist id",
        aheadTodolistTitle,
        aheadTodolistId
      );
      console.log(
        "current title, todolist id",
        currentTodolistTitle,
        currentTodolistId
      );

      console.log("ahead num of todos", aheadNumOfTodos);
      console.log("current num of todos", currentNumOfTodos);

      if (totalNumOfTodos === 0) {
        await axios
          .put(
            SINGLE_TODOLIST_URI(userId, aheadTodolistId),
            { title: currentTodolistTitle },
            {
              headers: {
                Authorization: jwt,
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => console.error(error));
        await axios
          .put(
            SINGLE_TODOLIST_URI(userId, currentTodolistId),
            { title: aheadTodolistTitle },
            {
              headers: {
                Authorization: jwt,
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => console.error(error));
        return;
      }

      // 1. Destructure the number of todos from the array elements
      // 2. Sort elements based on number of todos
      // in ascending order start from 0 to n. Ex: 0, 2;  1,2
      twoElementsArray.sort(({ numOfTodos: a }, { numOfTodos: b }) => {
        return a - b;
      });

      // Empty array of promises
      let promises = [];
      promises.push(
        axios.put(
          SINGLE_TODOLIST_URI(userId, aheadTodolistId),
          { title: currentTodolistTitle },
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
      );
      promises.push(
        axios.put(
          SINGLE_TODOLIST_URI(userId, currentTodolistId),
          { title: aheadTodolistTitle },
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
      );

      // If the first element in the array has no todos, the second element must have todos
      if (twoElementsArray[0].numOfTodos === 0) {
        // The new todolist id is the todolist id of the first element
        const newTodolistId = twoElementsArray[0].todolist.id;

        // Push axios put requests to promise array to all the todos with their new todolist ids
        for (let i = 0; i < twoElementsArray[1].numOfTodos; i++) {
          promises.push(
            axios.put(
              SINGLE_TODO_URI(
                userId,
                twoElementsArray[1].todolist.id,
                twoElementsArray[1].todos[i].id
              ),
              {
                newTodolistId,
              },
              {
                headers: {
                  Authorization: jwt,
                },
              }
            )
          );
        }

        // Execute all the promises
        await Promise.all(promises)
          .then((results) => console.log("change todos", results))
          .catch((error) => console.error(error));
        return;
      }

      // If the first element in the array has todos, the second element must have todos
      if (twoElementsArray[0].numOfTodos !== 0) {
        for (let i = 0; i < twoElementsArray[0].numOfTodos; i++) {
          // The new todolist id is the todolist id of the second element
          const newTodolistId = twoElementsArray[1].todolist.id;

          // Push axios put requests to promise array to all the todos with their new todolist ids
          promises.push(
            axios.put(
              SINGLE_TODO_URI(
                userId,
                twoElementsArray[0].todolist.id,
                twoElementsArray[0].todos[i].id
              ),
              {
                newTodolistId,
              },
              {
                headers: {
                  Authorization: jwt,
                },
              }
            )
          );
        }
        for (let i = 0; i < twoElementsArray[1].numOfTodos; i++) {
          // The new todolist id is the todolist id of the first element
          const newTodolistId = twoElementsArray[0].todolist.id;

          // Push axios put requests to promise array to all the todos with their new todolist ids
          promises.push(
            axios.put(
              SINGLE_TODO_URI(
                userId,
                twoElementsArray[1].todolist.id,
                twoElementsArray[1].todos[i].id
              ),
              {
                newTodolistId,
              },
              {
                headers: {
                  Authorization: jwt,
                },
              }
            )
          );
        }

        // Execute all the promises
        await Promise.all(promises)
          .then((results) => console.log("change todos", results))
          .catch((error) => console.error(error));
        return;
      }
    }
  };

  // Move todolist down the list
  const moveTodolistElementDown = async (array, index) => {
    const currentIndex = index;
    let behindIndex = 0;
    const todolistsArrayCopy = array;

    console.log(todolistsArrayCopy);
    console.log("down");
    console.log("current index", currentIndex);

    // Element is at the end of array, can't move it backwards
    if (currentIndex === todolistsArrayCopy.length - 1) {
      console.log("can't move down, already at the bottom");
    } else {
      behindIndex = index + 1;
      console.log("new index", behindIndex);

      // Swap the element after with the current element
      // [todolists[currentIndex], todolists[behindIndex]] = [
      //   todolists[behindIndex],
      //   todolists[currentIndex],
      // ];

      let twoElementsArray = [];

      // Slice the array to create a new array containing the two elements being swapped.
      twoElementsArray = todolistsArrayCopy.slice(
        currentIndex,
        behindIndex + 1
      );

      // Es6 Swap the element before with the current element
      [twoElementsArray[0], twoElementsArray[1]] = [
        twoElementsArray[1],
        twoElementsArray[0],
      ];
      console.log("2 elements array swapped", twoElementsArray);

      const totalNumOfTodos = twoElementsArray.reduce((sum, { numOfTodos }) => {
        return sum + numOfTodos;
      }, 0);

      console.log(totalNumOfTodos);

      const {
        title: behindTodolistTitle,
        id: behindTodolistId,
      } = todolistsArrayCopy[behindIndex].todolist;
      const {
        title: currentTodolistTitle,
        id: currentTodolistId,
      } = todolistsArrayCopy[currentIndex].todolist;
      const { numOfTodos: behindNumOfTodos } = todolistsArrayCopy[behindIndex];
      const { numOfTodos: currentNumOfTodos } = todolistsArrayCopy[
        currentIndex
      ];

      console.log(
        "behind title, todolist id",
        behindTodolistTitle,
        behindTodolistId
      );
      console.log(
        "current title, todolist id",
        currentTodolistTitle,
        currentTodolistId
      );

      console.log("behind num of todos", behindNumOfTodos);
      console.log("current num of todos", currentNumOfTodos);

      if (totalNumOfTodos === 0) {
        await axios
          .put(
            SINGLE_TODOLIST_URI(userId, behindTodolistId),
            { title: currentTodolistTitle },
            {
              headers: {
                Authorization: jwt,
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => console.error(error));
        await axios
          .put(
            SINGLE_TODOLIST_URI(userId, currentTodolistId),
            { title: behindTodolistTitle },
            {
              headers: {
                Authorization: jwt,
              },
            }
          )
          .then((response) => {
            console.log(response);
          })
          .catch((error) => console.error(error));
        return;
      }

      // 1. Destructure the number of todos from the array elements
      // 2. Sort elements based on number of todos
      // in ascending order start from 0 to n. Ex: 0, 2;  1,2
      twoElementsArray.sort(({ numOfTodos: a }, { numOfTodos: b }) => {
        return a - b;
      });

      console.log(twoElementsArray);

      // Empty array of promises
      let promises = [];
      promises.push(
        axios.put(
          SINGLE_TODOLIST_URI(userId, behindTodolistId),
          { title: currentTodolistTitle },
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
      );
      promises.push(
        axios.put(
          SINGLE_TODOLIST_URI(userId, currentTodolistId),
          { title: behindTodolistTitle },
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
      );

      // If the first element in the array has no todos, the second element must have todos
      if (twoElementsArray[0].numOfTodos === 0) {
        // The new todolist id is the todolist id of the first element
        const newTodolistId = twoElementsArray[0].todolist.id;

        // Push axios put requests to promise array to all the todos with their new todolist ids
        for (let i = 0; i < twoElementsArray[1].numOfTodos; i++) {
          promises.push(
            axios.put(
              SINGLE_TODO_URI(
                userId,
                twoElementsArray[1].todolist.id,
                twoElementsArray[1].todos[i].id
              ),
              {
                newTodolistId,
              },
              {
                headers: {
                  Authorization: jwt,
                },
              }
            )
          );
        }

        // Execute all the promises
        await Promise.all(promises)
          .then((results) => console.log("change todos", results))
          .catch((error) => console.error(error));
        return;
      }

      // If the first element in the array has todos, the second element must have todos
      if (twoElementsArray[0].numOfTodos !== 0) {
        for (let i = 0; i < twoElementsArray[0].numOfTodos; i++) {
          // The new todolist id is the todolist id of the second element
          const newTodolistId = twoElementsArray[1].todolist.id;

          // Push axios put requests to promise array to all the todos with their new todolist ids
          promises.push(
            axios.put(
              SINGLE_TODO_URI(
                userId,
                twoElementsArray[0].todolist.id,
                twoElementsArray[0].todos[i].id
              ),
              {
                newTodolistId,
              },
              {
                headers: {
                  Authorization: jwt,
                },
              }
            )
          );
        }
        for (let i = 0; i < twoElementsArray[1].numOfTodos; i++) {
          // The new todolist id is the todolist id of the first element
          const newTodolistId = twoElementsArray[0].todolist.id;

          // Push axios put requests to promise array to all the todos with their new todolist ids
          promises.push(
            axios.put(
              SINGLE_TODO_URI(
                userId,
                twoElementsArray[1].todolist.id,
                twoElementsArray[1].todos[i].id
              ),
              {
                newTodolistId,
              },
              {
                headers: {
                  Authorization: jwt,
                },
              }
            )
          );
        }

        // Execute all the promises
        await Promise.all(promises)
          .then((results) => console.log("change todos", results))
          .catch((error) => console.error(error));
        return;
      }
    }
  };

  // Move todo up a todolist
  const moveTodoElementUp = async (todos, index) => {
    const currentIndex = index;
    let aheadIndex = 0;
    const todosArrayCopy = todos;

    console.log(todosArrayCopy);

    if (currentIndex === 0) {
      console.log("can't move up, already at the top");
    } else {
      aheadIndex = index - 1;
      console.log("current index", currentIndex);
      console.log("new index", aheadIndex);

      let twoElementsArray = [];

      // Slice the array to create a new array containing the two elements being swapped.
      twoElementsArray = todosArrayCopy.slice(aheadIndex, currentIndex + 1);

      // Es6 Swap the element before with the current element
      [twoElementsArray[0], twoElementsArray[1]] = [
        twoElementsArray[1],
        twoElementsArray[0],
      ];

      const {
        description: aheadTodoDescription,
        id: aheadTodoId,
      } = todosArrayCopy[aheadIndex];
      const {
        description: currentTodoDescription,
        id: currentTodoId,
      } = todosArrayCopy[currentIndex];

      const { todolist_id: todolistId } = todosArrayCopy[currentIndex];

      console.log("ahead description", aheadTodoDescription);
      console.log("current description", currentTodoDescription);
      console.log("todolist id", todolistId);

      await axios
        .put(
          SINGLE_TODO_URI(userId, todolistId, aheadTodoId),
          { description: currentTodoDescription },
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.error(error));
      await axios
        .put(
          SINGLE_TODO_URI(userId, todolistId, currentTodoId),
          { description: aheadTodoDescription },
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.error(error));
      return;
    }
  };

  // Move todo down a todolist
  const moveTodoElementDown = async (todos, index) => {
    const currentIndex = index;
    let behindIndex = 0;
    const todosArrayCopy = todos;

    if (currentIndex === todos.length - 1) {
      console.log("can't move down, already at the bottom");
    } else {
      behindIndex = index + 1;
      console.log("new index", behindIndex);

      let twoElementsArray = [];

      // Slice the array to create a new array containing the two elements being swapped.
      twoElementsArray = todosArrayCopy.slice(currentIndex, behindIndex + 1);

      // Es6 Swap the element before with the current element
      [twoElementsArray[0], twoElementsArray[1]] = [
        twoElementsArray[1],
        twoElementsArray[0],
      ];

      const {
        description: behindTodoDescription,
        id: behindTodoId,
      } = todosArrayCopy[behindIndex];
      const {
        description: currentTodoDescription,
        id: currentTodoId,
      } = todosArrayCopy[currentIndex];

      const { todolist_id: todolistId } = todosArrayCopy[currentIndex];

      console.log("behind description", behindTodoDescription);
      console.log("current description", currentTodoDescription);
      console.log("todolist id", todolistId);

      await axios
        .put(
          SINGLE_TODO_URI(userId, todolistId, behindTodoId),
          { description: currentTodoDescription },
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.error(error));
      await axios
        .put(
          SINGLE_TODO_URI(userId, todolistId, currentTodoId),
          { description: behindTodoDescription },
          {
            headers: {
              Authorization: jwt,
            },
          }
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.error(error));
      return;
    }
  };

  const reorderData = (array) => {
    if (moveUp) {
      moveTodolistElementUp(array, index);
      setMoveUp(false);
    }
    if (moveDown) {
      moveTodolistElementDown(array, index);
      setMoveDown(false);
    }
  };

  useEffect(() => {
    if (reordering) {
      reorderData(todolists);
      setReordering(false);
    }
  }, [reordering]);

  return (
    <li>
      <button
        style={buttonStyle}
        onClick={() => {
          setReordering(true);
          setMoveUp(true);
        }}
      >
        Up
      </button>
      <button
        style={buttonStyle}
        onClick={() => {
          setReordering(true);
          setMoveDown(true);
        }}
      >
        Down
      </button>
      <button
        style={buttonStyle}
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
          style={buttonStyle}
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
        <button style={buttonStyle} onClick={() => showEditTodolist()}>
          Edit Title
        </button>
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
        style={buttonStyle}
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
                index={i}
                todos={todos}
                jwt={jwt}
                userId={userId}
                todolists={todolists}
                todolistId={todolistId}
                todolistIndex={index}
                todoId={todo.id}
                description={todo.description}
                setFetching={setFetching}
                moveTodoElementUp={moveTodoElementUp}
                moveTodoElementDown={moveTodoElementDown}
                reordering={reordering}
                setReordering={setReordering}
                reorderData={reorderData}
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
