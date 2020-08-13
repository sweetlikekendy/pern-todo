import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Todo } from "../Todo";
import {
  SINGLE_TODOLIST_URI,
  TODOS_URI,
  SINGLE_TODO_URI,
} from "../../endpoints";

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

  // Move todolist up the list
  const moveTodolistElementUp = (array, index) => {
    const currentIndex = index;
    let newIndex = 0;

    console.log(todolists);
    console.log("up");
    console.log("current index", currentIndex);
    if (currentIndex === 0) {
      console.log("can't move up, already at the top");
    } else {
      newIndex = index - 1;
      console.log("new index", newIndex);

      // Es6 Swap the element before with the current element
      [todolists[newIndex], todolists[currentIndex]] = [
        todolists[currentIndex],
        todolists[newIndex],
      ];

      window.localStorage.setItem("todolists", JSON.stringify(todolists));
    }
  };

  // Move todolist down the list
  const moveTodolistElementDown = (todolists, index) => {
    const currentIndex = index;
    let newIndex = 0;

    console.log(todolists);
    console.log("down");
    console.log("current index", currentIndex);
    if (currentIndex === todolists.length - 1) {
      console.log("can't move down, already at the bottom");
    } else {
      newIndex = index + 1;
      console.log("new index", newIndex);

      // Swap the element after with the current element
      [todolists[currentIndex], todolists[newIndex]] = [
        todolists[newIndex],
        todolists[currentIndex],
      ];

      window.localStorage.setItem("todolists", JSON.stringify(todolists));
    }
  };

  // Move todo up a todolist
  const moveTodoElementUp = (todolists, todolistIndex, todos, index) => {
    const currentIndex = index;
    let newIndex = 0;

    if (currentIndex === 0) {
      console.log("can't move up, already at the top");
    } else {
      newIndex = index - 1;
      console.log("new index", newIndex);

      const elementCurrent = todos[currentIndex];
      const elementAhead = todos[newIndex];

      console.log("current element", elementCurrent);
      console.log("element ahead", elementAhead);
      todos[currentIndex] = elementAhead;
      todos[newIndex] = elementCurrent;

      const newTodolistElement = {
        numOfTodos: todolists[todolistIndex].numOfTodos,
        todolist: todolists[todolistIndex].todolist,
        todos: ([todos[currentIndex], todos[newIndex]] = [
          todos[newIndex],
          todos[currentIndex],
        ]),
      };

      console.log(newTodolistElement);
      todolists[todolistIndex] = newTodolistElement;
      console.log(todolists);
      window.localStorage.setItem("todolists", JSON.stringify(todolists));
    }
  };

  // Move todo down a todolist
  const moveTodoElementDown = (todolists, todolistIndex, todos, index) => {
    const currentIndex = index;
    let newIndex = 0;

    if (currentIndex === todos.length - 1) {
      console.log("can't move down, already at the bottom");
    } else {
      newIndex = index + 1;
      console.log("new index", newIndex);

      const elementCurrent = todos[currentIndex];
      const elementAhead = todos[newIndex];

      console.log("current element", elementCurrent);
      console.log("element ahead", elementAhead);
      todos[currentIndex] = elementAhead;
      todos[newIndex] = elementCurrent;

      const newTodolistElement = {
        numOfTodos: todolists[todolistIndex].numOfTodos,
        todolist: todolists[todolistIndex].todolist,
        todos: ([todos[newIndex], todos[currentIndex]] = [
          todos[currentIndex],
          todos[newIndex],
        ]),
      };

      console.log(newTodolistElement);
      todolists[todolistIndex] = newTodolistElement;
      console.log(todolists);
      window.localStorage.setItem("todolists", JSON.stringify(todolists));
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
