import React, { useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Input } from "../styles";
import { deleteTodolist, selectTodolistById, updateTodolist } from "../features/todolists/todolistsSlice";
import { selectTodoIds, selectTodosByTodolist } from "../features/todos/todosSlice";
import TodoRedux from "./TodoRedux";

const TodolistRedux = ({ todolistId, ...rest }) => {
  const dispatch = useDispatch();
  const todolist = useSelector((state) => selectTodolistById(state, todolistId));
  // const todoIds = useSelector(selectTodoIds, shallowEqual);

  const todosInCurrentTodolist = useSelector((state) => selectTodosByTodolist(state, todolistId));

  const { dndId, title, todos, user_id: userId } = todolist;

  const [isTitleFocus, setTitleFocusState] = useState(false);
  const [newTodolistTitle, setNewTodolistTitle] = useState(title);
  const [isFormSubmitting, setFormState] = useState(false);

  // Used for single user in redux store
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

  const handleDeleteClick = async () => {
    try {
      const resultAction = await dispatch(deleteTodolist({ jwt, userId, todolistId }));
      unwrapResult(resultAction);
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdateSubmit = async (e) => {
    e.preventDefault();
    setFormState(!isFormSubmitting);
    if (newTodolistTitle !== title) {
      try {
        const resultAction = await dispatch(updateTodolist({ userId, todolistId, title: newTodolistTitle, jwt }));
        unwrapResult(resultAction);
      } catch (error) {
        console.error(error);
      } finally {
        setFormState(!isFormSubmitting);
        setTitleFocusState(!isTitleFocus);
      }
    }
  };

  return (
    <div className="p-4" {...rest}>
      <div className="flex justify-between">
        {isTitleFocus && !isFormSubmitting ? (
          <form onSubmit={(e) => onUpdateSubmit(e)}>
            <label htmlFor={dndId}>
              <Input type="text" value={newTodolistTitle} onChange={(e) => setNewTodolistTitle(e.target.value)} />
            </label>

            {isTitleFocus && !isFormSubmitting && (
              <button
                className="mr-2"
                type="button"
                onClick={(e) => {
                  onUpdateSubmit(e);
                  setTitleFocusState(!isTitleFocus);
                }}
              >
                Done
              </button>
            )}
          </form>
        ) : (
          <h3 className="mb-3 text-2xl">{title}</h3>
        )}
        <div>
          <button className="mr-2" onClick={() => setTitleFocusState(!isTitleFocus)}>
            {!isTitleFocus && `Edit`}
          </button>
          <button onClick={() => handleDeleteClick()}>Delete</button>
        </div>
      </div>

      <ol>{todoContent}</ol>
    </div>
  );
};

export default TodolistRedux;
