import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { selectTodolistById, updateTodolist } from "../features/todolists/todolistsSlice";
import { addTodo, selectTodosByTodolist } from "../features/todos/todosSlice";
import TodoRedux from "./TodoRedux";
import { MdKeyboardArrowDown } from "react-icons/md";
import TodolistMenu from "./TodolistMenu";

const TodolistRedux = ({ todolistId, ...rest }) => {
  const dispatch = useDispatch();
  const todolist = useSelector((state) => selectTodolistById(state, todolistId));
  const [isShowCompletedTodos, setShowCompletedTodos] = useState(false);

  const addTodoInputEl = useRef(null);
  const todolistTitleEl = useRef(null);
  const newTodolistTitleEl = useRef(null);

  const todosInCurrentTodolist = useSelector((state) => selectTodosByTodolist(state, todolistId));

  const { dndId, title, user_id: userId } = todolist;

  const [isTodolistTitleFocus, setTodolistTitleFocus] = useState(false);
  const [newTodolistTitle, setNewTodolistTitle] = useState(title);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [newTodo, setNewTodo] = useState("");

  // Get JWT for http requests
  const loggedInUserData = useSelector((state) => {
    if (state.users.ids.length > 0) {
      const { users } = state;
      const { ids: userIds, entities: userEntities } = users;
      const { token } = userEntities[userIds[0]];

      return { token };
    }
    return { token: `` };
  });

  const { token: jwt } = loggedInUserData;

  let completedTodoContent = [];
  let incompleteTodoContent = [];

  if (todosInCurrentTodolist.length > 0) {
    todosInCurrentTodolist.map((todo) => {
      const { id, isComplete } = todo;

      if (isComplete) {
        completedTodoContent.push(<TodoRedux key={id} todoId={id} />);
      } else {
        incompleteTodoContent.push(<TodoRedux key={id} todoId={id} />);
      }
    });
  }

  const numOfCompletedTodos = completedTodoContent.length;
  const numOfTotalTodos = todosInCurrentTodolist.length;

  const isTodolistEmpty = numOfTotalTodos === 0 ? true : false;
  const isCompletedTodosEmpty = numOfCompletedTodos === 0 ? true : false;

  const canSave = [newTodo].every(Boolean) && addRequestStatus === "idle";

  const onTodolistTitleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (newTodolistTitle !== title) {
      try {
        const updateTodolistAction = await dispatch(
          updateTodolist({ userId, todolistId, jwt, title: newTodolistTitle })
        );
        unwrapResult(updateTodolistAction);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const onCreateTodoSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
      try {
        setAddRequestStatus("pending");
        const createTodoAction = await dispatch(addTodo({ userId, todolistId, jwt, description: newTodo }));

        unwrapResult(createTodoAction);
        setNewTodo("");
      } catch (err) {
        console.error("Failed to save the post: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  useEffect(() => {
    if (isTodolistTitleFocus) {
      newTodolistTitleEl.current.focus();
    }
  }, [isTodolistTitleFocus, newTodolistTitleEl]);

  return (
    <div
      className="relative w-full md:w-max"
      {...rest}
      // onMouseEnter={() => setTodolistHover(true)}
      // onMouseLeave={() => setTodolistHover(false)}
    >
      <div className="container p-4 max-w-md mx-auto">
        {/* <!-- todo wrapper --> */}
        <div className="bg-white rounded shadow" x-data="app()">
          {isTodolistTitleFocus ? (
            <form
              className="p-4"
              onSubmit={(e) => {
                onTodolistTitleUpdateSubmit(e);
                setTodolistTitleFocus(false);
              }}
            >
              <input
                type="text"
                placeholder={newTodolistTitle}
                className=" rounded shadow-sm px-4 py-2 border border-gray-200 w-full mt-4"
                value={newTodolistTitle}
                onChange={(e) => setNewTodolistTitle(e.target.value)}
                ref={newTodolistTitleEl}
              />
              <div className="w-full flex justify-end mt-2">
                <button type="button" title="Cancel todolist edit" onClick={() => setTodolistTitleFocus(false)}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="ml-3"
                  title="Confirm todolist edit"
                  onClick={(e) => {
                    onTodolistTitleUpdateSubmit(e);
                    setTodolistTitleFocus(false);
                  }}
                >
                  Update
                </button>
              </div>
            </form>
          ) : (
            <button
              ref={todolistTitleEl}
              className="font-bold text-lg p-4"
              title="Double click to edit todolist title"
              onDoubleClick={() => {
                setTodolistTitleFocus(true);
              }}
            >
              {title}
            </button>
          )}
          <div className="flex items-center text-sm mt-2 px-4 py-1">
            <button onClick={() => addTodoInputEl.current.focus()}>
              <svg
                className="w-3 h-3 mr-3 focus:outline-none"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M12 4v16m8-8H4"></path>
              </svg>
            </button>
            <span>Click to add todo</span>
          </div>
          <form className="px-4" onSubmit={(e) => onCreateTodoSubmit(e)}>
            <input
              type="text"
              placeholder="Enter a todo here"
              className=" rounded shadow-sm px-4 py-2 border border-gray-200 w-full mt-4"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
              ref={addTodoInputEl}
            />
          </form>

          {/* <!-- todo list --> */}
          <div className={`mt-4 px-4 ${!isCompletedTodosEmpty ? `divide-y-2` : ``}`}>
            {incompleteTodoContent.length > 0 && <ul className="p-1">{incompleteTodoContent}</ul>}
            <div className="pt-4 px-1 pb-1">
              {!isTodolistEmpty && numOfCompletedTodos !== 0 && (
                <React.Fragment>
                  <button
                    className="mb-3 flex items-center "
                    onClick={() => setShowCompletedTodos(!isShowCompletedTodos)}
                  >
                    {numOfCompletedTodos} Completed <MdKeyboardArrowDown className="ml-" />
                  </button>
                  {isShowCompletedTodos && (
                    <React.Fragment>
                      <div className="p-1">
                        <ul>{completedTodoContent}</ul>
                      </div>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
          <TodolistMenu todolistId={todolistId} />
        </div>
      </div>
    </div>
  );
};

export default TodolistRedux;

TodolistRedux.propTypes = {
  todolistId: PropTypes.number,
};
