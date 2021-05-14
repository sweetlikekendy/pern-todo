import React from "react";
import { useSelector, shallowEqual } from "react-redux";
import { selectTodolistIds } from "../features/todolists/todolistsSlice";
import TodolistRedux from "./TodolistRedux";

const TodolistListRedux = () => {
  const todolistIds = useSelector(selectTodolistIds, shallowEqual);

  let todolistContent = [];

  if (todolistIds.length > 0) {
    todolistIds.map((todolistId) => todolistContent.push(<TodolistRedux key={todolistId} todolistId={todolistId} />));
  } else {
    todolistContent = <div>There are no to-do lists</div>;
  }

  return (
    <div className="max-w-6xl mx-auto ">
      <div className="px-4 py-2 md:px-8 md:py-6 xl:px-12 xl:py-8 flex justify-center flex-wrap">{todolistContent}</div>
    </div>
  );
};

export default TodolistListRedux;
