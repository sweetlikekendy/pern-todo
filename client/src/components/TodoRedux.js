import React from "react";
import { useSelector } from "react-redux";
import { selectTodoById } from "../features/todos/todosSlice";

function TodoRedux({ todoId }) {
  const todo = useSelector((state) => selectTodoById(state, todoId));

  return <li>{todo.description}</li>;
}

export default TodoRedux;
