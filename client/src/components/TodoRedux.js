import { unwrapResult } from "@reduxjs/toolkit";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTodoById, updateTodo, deleteTodo } from "../features/todos/todosSlice";

function TodoRedux({ todoId }) {
  const dispatch = useDispatch();
  const todo = useSelector((state) => selectTodoById(state, todoId));
  const { dndId, description, todolist_id: todolistId, isComplete } = todo;

  const [isTodoFocus, setTodoFocus] = useState(false);
  const [newTodoDescription, setNewTodoDescription] = useState(description);

  const [isTodoHover, setTodoHover] = useState(false);

  const newTodoEl = useRef(null);

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
    options: {
      updateTodoDescription: false,
      toggleTodoCompletion: false,
    },
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
    if (canSave && newTodoDescription !== description) {
      try {
        const todoDescriptionOptions = {
          ...todoRequestOptions,
          description: newTodoDescription,
          options: {
            ...todoRequestOptions.options,
            updateTodoDescription: true,
          },
        };
        const resultAction = await dispatch(updateTodo(todoDescriptionOptions));
        unwrapResult(resultAction);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleCompletionChange = async (e) => {
    try {
      const todoCompletionOptions = {
        ...todoRequestOptions,
        isComplete: !e.target.checked,
        options: {
          ...todoRequestOptions.options,
          toggleTodoCompletion: true,
        },
      };
      const resultAction = await dispatch(updateTodo(todoCompletionOptions));
      unwrapResult(resultAction);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <li
      className={`flex justify-between items-center mt-1 p-2 ${
        isComplete ? `line-through bg-coolGray-200` : `no-underline`
      }`}
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
          <input
            type="text"
            placeholder={newTodoDescription}
            className=" rounded shadow-sm px-4 py-2 border border-gray-200 w-full mt-4"
            value={newTodoDescription}
            onChange={(e) => setNewTodoDescription(e.target.value)}
            ref={newTodoEl}
          />
          <div className="w-full flex justify-end mt-2">
            <button type="button" title="Cancel todo edit" onClick={() => setTodoFocus(false)}>
              Cancel
            </button>
            <button
              type="submit"
              className="ml-3"
              title="Confirm todo edit"
              onClick={(e) => {
                onTodoUpdateSubmit(e);
                setTodoFocus(false);
              }}
            >
              Update
            </button>
          </div>
        </form>
      ) : (
        <React.Fragment>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="rounded hover:border-coolGray-500 hover:cursor-pointer"
              defaultChecked={isComplete}
              name="complete"
              id="complete"
              x-model="todo.isComplete"
              onChange={(e) => handleCompletionChange(e)}
            />

            <button
              className="ml-3 text-sm "
              title="Double click to edit title"
              onDoubleClick={() => setTodoFocus(true)}
            >
              {description}
            </button>
          </div>

          <button
            className={`ml-4 ${isTodoHover ? `opacity-1` : `opacity-0`} transition-opacity`}
            onClick={() => handleTodoDeleteClick()}
          >
            <svg
              className=" w-4 h-4 text-coolGray-500 fill-current hover:text-coolGray-900"
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
