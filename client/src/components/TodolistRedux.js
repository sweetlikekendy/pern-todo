import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { selectTodolistById, updateTodolist } from "../features/todolists/todolistsSlice";
import { addTodo, selectTodosByTodolist } from "../features/todos/todosSlice";
import TodoRedux from "./TodoRedux";
import { AiOutlinePlus } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import TodolistMenu from "./TodolistMenu";
import { selectAllUsers } from "../features/users/usersSlice";

export default function TodolistRedux({ todolistId, ...rest }) {
  const dispatch = useDispatch();
  const todolist = useSelector((state) => selectTodolistById(state, todolistId));

  const addTodoInputEl = useRef(null);
  const todolistTitleEl = useRef(null);

  const { dndId, title, user_id: userId } = todolist;

  const [isTodolistTitleFocus, setTodolistTitleFocus] = useState(false);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [newTodo, setNewTodo] = useState("");

  const users = useSelector((state) => selectAllUsers(state));
  const loggedInUser = users[0];

  const { token: jwt } = loggedInUser;

  const canSave = [newTodo].every(Boolean) && addRequestStatus === "idle";

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

  return (
    <div className="relative w-full md:w-max" {...rest}>
      <div className="container p-4 max-w-md mx-auto">
        {/* todo wrapper */}
        <div className="bg-white rounded shadow" x-data="app()">
          {isTodolistTitleFocus ? (
            <NewTodolistForm
              todolistId={todolistId}
              isTodolistTitleFocus={isTodolistTitleFocus}
              setTodolistTitleFocus={setTodolistTitleFocus}
            />
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
            <button className="mr-1" onClick={() => addTodoInputEl.current.focus()}>
              <AiOutlinePlus className="h-4 w-4" />
            </button>
            <span>Click to add to-do</span>
          </div>
          <form className="px-4" onSubmit={(e) => onCreateTodoSubmit(e)}>
            <input
              type="text"
              placeholder="Enter a to-do here"
              className=" rounded shadow-sm px-4 py-2 border border-gray-200 w-full mt-4"
              onChange={(e) => setNewTodo(e.target.value)}
              value={newTodo}
              ref={addTodoInputEl}
            />
          </form>

          {/* todo list */}
          <TodolistContent todolistId={todolistId} />
          <TodolistMenu todolistId={todolistId} />
        </div>
      </div>
    </div>
  );
}

TodolistRedux.propTypes = {
  todolistId: PropTypes.number,
};

export function NewTodolistForm({ todolistId, isTodolistTitleFocus, setTodolistTitleFocus }) {
  const dispatch = useDispatch();
  const todolist = useSelector((state) => selectTodolistById(state, todolistId));
  const { title } = todolist;
  const [newTodolistTitle, setNewTodolistTitle] = useState(title);
  const newTodolistTitleEl = useRef(null);

  const users = useSelector((state) => selectAllUsers(state));
  const loggedInUser = users[0];

  const { token: jwt, user_id: userId } = loggedInUser;

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

  useEffect(() => {
    if (isTodolistTitleFocus) {
      newTodolistTitleEl.current.focus();
    }
  }, [isTodolistTitleFocus, newTodolistTitleEl]);

  return (
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
  );
}

NewTodolistForm.propTypes = {
  todolistId: PropTypes.number,
  isTodolistTitleFocus: PropTypes.bool,
  setTodolistTitleFocus: PropTypes.func,
};

export function TodolistContent({ todolistId }) {
  const todosInCurrentTodolist = useSelector((state) => selectTodosByTodolist(state, todolistId));
  const [isShowCompletedTodos, setShowCompletedTodos] = useState(false);

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

  return (
    <div className={`mt-4 px-4 ${!isCompletedTodosEmpty ? `divide-y-2` : ``}`}>
      {incompleteTodoContent.length > 0 && <ul className="p-1">{incompleteTodoContent}</ul>}
      <div className="pt-4 px-1 pb-1">
        {!isTodolistEmpty && numOfCompletedTodos !== 0 && (
          <React.Fragment>
            <button className="mb-3 flex items-center " onClick={() => setShowCompletedTodos(!isShowCompletedTodos)}>
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
  );
}

TodolistContent.propTypes = { todolistId: PropTypes.number };
