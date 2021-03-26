import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Input } from "../styles";
import { deleteTodolist, selectTodolistById, updateTodolist } from "../features/todolists/todolistsSlice";

const TodolistRedux = ({ todolistId, ...rest }) => {
  const dispatch = useDispatch();
  const todolist = useSelector((state) => selectTodolistById(state, todolistId));
  // console.log(todolist);
  const { dndId, title, todos, user_id: userId } = todolist;

  const [titleFocusState, setTitleFocusState] = useState(false);
  const [newTodolistTitle, setNewTodolistTitle] = useState(title);

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

  const handleDeleteClick = async () => {
    try {
      const resultAction = await dispatch(deleteTodolist({ jwt, userId, todolistId }));
      unwrapResult(resultAction);
    } catch (error) {
      console.error(error);
    }
  };

  const onUpdateSubmit = async () => {
    console.log(newTodolistTitle, title);
    if (newTodolistTitle !== title) {
      try {
        const resultAction = await dispatch(updateTodolist({ userId, todolistId, title: newTodolistTitle, jwt }));
        unwrapResult(resultAction);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="p-4" {...rest}>
      <div className="flex justify-between">
        {titleFocusState ? (
          <form>
            <label htmlFor={dndId}>
              <Input type="text" value={newTodolistTitle} onChange={(e) => setNewTodolistTitle(e.target.value)} />
            </label>

            {titleFocusState && (
              <button
                className="mr-2"
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  onUpdateSubmit();
                  setTitleFocusState(!titleFocusState);
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
          <button className="mr-2" onClick={() => setTitleFocusState(!titleFocusState)}>
            {!titleFocusState && `Edit`}
          </button>
          <button onClick={() => handleDeleteClick()}>Delete</button>
        </div>
      </div>
      <ol>
        {todos.map((todo) => {
          return <li key={todo.id}>{todo.description}</li>;
        })}
      </ol>
    </div>
  );
};

export default TodolistRedux;
