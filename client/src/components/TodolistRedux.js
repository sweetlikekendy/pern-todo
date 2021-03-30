import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Input } from "../styles";
import { deleteTodolist, selectTodolistById, updateTodolist } from "../features/todolists/todolistsSlice";
import { addTodo, selectTodoIds, selectTodosByTodolist } from "../features/todos/todosSlice";
import TodoRedux from "./TodoRedux";

const TodolistRedux = ({ todolistId, ...rest }) => {
  const dispatch = useDispatch();
  const todolist = useSelector((state) => selectTodolistById(state, todolistId));
  // const todoIds = useSelector(selectTodoIds, shallowEqual);

  const todosInCurrentTodolist = useSelector((state) => selectTodosByTodolist(state, todolistId));

  const { dndId, title, user_id: userId } = todolist;

  const [isTodolistFocus, setTodolistFocus] = useState(false);
  const [newTodolistTitle, setNewTodolistTitle] = useState(title);
  const [isFormSubmitting, setFormState] = useState(false);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [newTodo, setNewTodo] = useState("");

  // Get JWT for http requests
  const loggedInUserData = useSelector((state) => {
    // if there's a user, that means user has logged in
    if (state.users.ids.length > 0) {
      const { users } = state;
      const { ids: userIds, entities: userEntities } = users;
      const { token } = userEntities[userIds[0]];

      return { token };
    }
    return { token: `` };
  });

  const { token: jwt } = loggedInUserData;

  let todoContent = [];

  if (todosInCurrentTodolist.length > 0) {
    todosInCurrentTodolist.map((todo) => todoContent.push(<TodoRedux key={todo.id} todoId={todo.id} />));
  } else {
    todoContent = <div>Empty todolist</div>;
  }

  const canSave = [newTodo].every(Boolean) && addRequestStatus === "idle";

  const handleTodolistDeleteClick = async () => {
    try {
      const resultAction = await dispatch(deleteTodolist({ jwt, userId, todolistId }));
      unwrapResult(resultAction);
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdateSubmit = async (e) => {
    e.preventDefault();
    if (newTodolistTitle !== title) {
      setFormState(true);
      try {
        const resultAction = await dispatch(updateTodolist({ userId, todolistId, jwt, title: newTodolistTitle }));
        unwrapResult(resultAction);
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
        const resultAction = await dispatch(addTodo({ userId, todolistId, jwt, description: newTodo }));

        unwrapResult(resultAction);
        setNewTodo("");
      } catch (err) {
        console.error("Failed to save the post: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <div className="p-4" {...rest}>
      <div className="flex justify-between">
        {isTodolistFocus && !isFormSubmitting ? (
          <form
            onSubmit={(e) => {
              onUpdateSubmit(e);
              setTodolistFocus(false);
              setFormState(false);
            }}
          >
            <label htmlFor={dndId}>
              <Input type="text" value={newTodolistTitle} onChange={(e) => setNewTodolistTitle(e.target.value)} />
            </label>

            {isTodolistFocus && !isFormSubmitting && (
              <button
                className="mr-2"
                type="button"
                onClick={(e) => {
                  onUpdateSubmit(e);
                  setTodolistFocus(false);
                  setFormState(false);
                }}
              >
                Done
              </button>
            )}
          </form>
        ) : (
          <h3 className="mb-3 mr-6 text-2xl">{title}</h3>
        )}
        <div>
          <button className="mr-2" onClick={() => setTodolistFocus(true)}>
            {!isTodolistFocus && `Edit`}
          </button>
          <button onClick={() => handleTodolistDeleteClick()}>Delete</button>
        </div>
      </div>
      <form onSubmit={(e) => onCreateTodoSubmit(e)} className="mb-4">
        <Input
          full
          border
          type="text"
          name="description"
          value={newTodo}
          placeholder="Enter new todo here"
          onChange={(e) => setNewTodo(e.target.value)}
        />
      </form>
      <ol>{todoContent}</ol>
    </div>
  );
};

export default TodolistRedux;
