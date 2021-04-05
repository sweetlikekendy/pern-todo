import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { deleteTodolist, selectTodolistById, updateTodolist } from "../features/todolists/todolistsSlice";
import { addTodo, deleteCompletedTodos, selectTodoIds, selectTodosByTodolist } from "../features/todos/todosSlice";
import TodoRedux from "./TodoRedux";
import { FiTrash2 } from "react-icons/fi";
import { MdKeyboardArrowDown } from "react-icons/md";
import DeleteTodolistConfirmationModal from "./DeleteTodolistConfirmationModal";

const TodolistRedux = ({ todolistId, ...rest }) => {
  const dispatch = useDispatch();
  const todolist = useSelector((state) => selectTodolistById(state, todolistId));
  const [isTodolistHover, setTodolistHover] = useState(false);
  const [isConfirmationDelete, setDeleteConfirmation] = useState(false);
  const [isShowCompletedTodos, setShowCompletedTodos] = useState(false);

  const addTodoInputEl = useRef(null);
  const todolistTitleEl = useRef(null);
  const newTodolistTitleEl = useRef(null);
  // const todoIds = useSelector(selectTodoIds);

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

  const completedTodoIds = completedTodoContent.map((todoEl) => parseInt(todoEl.key));

  const numOfCompletedTodos = completedTodoContent.length;
  const numOfTotalTodos = todosInCurrentTodolist.length;

  const CompletedOverIncompleteTodos = ({ children }) => (
    <div className="mt-4 text-coolGray-400 text-right">
      <span className="text-coolGray-500">{children}</span> Completed
    </div>
  );

  const isTodolistEmpty = numOfTotalTodos === 0 ? true : false;
  const isCompletedTodosEmpty = numOfCompletedTodos === 0 ? true : false;

  const completedOverIncompleteTodoContent = !isTodolistEmpty && (
    <CompletedOverIncompleteTodos>
      {numOfCompletedTodos} / {numOfTotalTodos}
    </CompletedOverIncompleteTodos>
  );

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

  const handleDeleteAllCompletedTodos = async (e) => {
    // e.preventDefault();
    try {
      const deleteAllCompletedTodosAction = await dispatch(
        deleteCompletedTodos({ jwt, userId, todolistId, completedTodoIds })
      );
    } catch (error) {
      console.error(error);
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
      className="relative"
      {...rest}
      onMouseEnter={() => setTodolistHover(true)}
      onMouseLeave={() => setTodolistHover(false)}
    >
      {isConfirmationDelete && (
        <DeleteTodolistConfirmationModal todolistId={todolistId} setModalState={setDeleteConfirmation} />
      )}

      <button
        className={`absolute top-0 right-0 z-10 bg-coolGray-100 p-2 rounded-full shadow-md ${
          isTodolistHover ? `opacity-1` : `opacity-0`
        } 
        transition-opacity
        hover:shadow-lg`}
        title="Click to delete todolist"
        onClick={() => setDeleteConfirmation(true)}
      >
        <FiTrash2 className="text-coolGray-800" />
      </button>

      <div className="container p-4 max-w-md mx-auto">
        {/* <!-- todo wrapper --> */}
        <div className="bg-white rounded shadow px-4 py-4" x-data="app()">
          {isTodolistTitleFocus ? (
            <form
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
              className="font-bold text-lg"
              title="Double click to edit todolist title"
              onDoubleClick={() => {
                setTodolistTitleFocus(true);
              }}
            >
              {title}
            </button>
          )}
          <div className="flex items-center text-sm mt-2">
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
          <form onSubmit={(e) => onCreateTodoSubmit(e)}>
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
          <div className={`mt-4 ${!isCompletedTodosEmpty ? `divide-y-2` : ``}`}>
            <ul className="p-1">{incompleteTodoContent}</ul>
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
                        <button
                          className="text-white mt-4 text-right bg-red-400 px-2 py-1 rounded"
                          onClick={() => handleDeleteAllCompletedTodos()}
                        >
                          Clear all completed
                        </button>
                      </div>
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </div>
          </div>
          {/* {completedOverIncompleteTodoContent} */}
        </div>
      </div>
    </div>
  );
};

export default TodolistRedux;
