import { unwrapResult } from "@reduxjs/toolkit";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTodoById, updateTodo, deleteTodo } from "../features/todos/todosSlice";
import { Input } from "../styles";

function TodoRedux({ todoId }) {
  const dispatch = useDispatch();
  const todo = useSelector((state) => selectTodoById(state, todoId));
  const { dndId, description, todolist_id: todolistId } = todo;

  const [isTodoFocus, setTodoFocus] = useState(false);
  const [newTodoDescription, setNewTodoDescription] = useState(description);

  const [isTodoHover, setTodoHover] = useState(false);

  const todoEl = useRef(null);

  // Get user_id & JWT for http requests
  const loggedInUserData = useSelector((state) => {
    if (state.users.ids.length > 0) {
      const { users } = state;
      const { ids: userIds, entities: userEntities } = users;
      const { id, token } = userEntities[userIds[0]];

      return { id, token };
    }
    return { id: ``, token: `` };
  });

  const { id: userId, token: jwt } = loggedInUserData;

  const canSave = [newTodoDescription].every(Boolean);

  const todoRequestOptions = {
    jwt,
    userId,
    todolistId,
    todoId,
  };

  const handleTodoDeleteClick = async () => {
    try {
      const resultAction = await dispatch(deleteTodo(todoRequestOptions));
      unwrapResult(resultAction);
    } catch (error) {
      console.error(error);
    }
  };

  const onTodoUpdateSubmit = async (e) => {
    e.preventDefault();
    if (newTodoDescription !== description) {
      try {
        const resultAction = await dispatch(updateTodo({ ...todoRequestOptions, description: newTodoDescription }));
        unwrapResult(resultAction);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <li
      className="flex justify-between items-center mt-3"
      x-show="todo.title !== ''"
      onMouseEnter={() => setTodoHover(true)}
      onMouseLeave={() => setTodoHover(false)}
    >
      {isTodoFocus ? (
        <form
          onSubmit={(e) => {
            onTodoUpdateSubmit(e);
            setTodoFocus(false);
          }}
        >
          {/* <label htmlFor={dndId}>
              <Input type="text" value={newTodoDescription} onChange={(e) => setNewTodoDescription(e.target.value)} />
            </label> */}
          {/* 
            {isTodoFocus && (
              <button
                className="mr-2"
                type="button"
                onClick={(e) => {
                  onTodoUpdateSubmit(e);
                  setTodoFocus(false);
                 
                }}
              >
                Done
              </button>
            )} */}
        </form>
      ) : (
        <React.Fragment>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="rounded hover:border-coolGray-500 hover:cursor-pointer"
              name=""
              id=""
              x-model="todo.isComplete"
            />

            <p className="capitalize ml-3 text-sm ">{description}</p>
          </div>

          <button
            className={`ml-4 ${isTodoHover ? `opacity-1` : `opacity-0`} transition-opacity`}
            onClick={() => handleTodoDeleteClick()}
          >
            <svg
              className=" w-4 h-4 text-coolGray-500 fill-current hover:text-coolGray-900"
              // @click="deleteTodo(todo.id)"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </React.Fragment>
      )}
    </li>
  );
}

export default TodoRedux;
