import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTodoById, updateTodo, deleteTodo } from "../features/todos/todosSlice";
import { Input } from "../styles";

function TodoRedux({ todoId }) {
  const dispatch = useDispatch();
  const todo = useSelector((state) => selectTodoById(state, todoId));
  const { dndId, description, todolist_id: todolistId } = todo;

  const [isTodoFocus, setTodoFocus] = useState(false);
  const [newTodoDescription, setNewTodoDescription] = useState(description);
  const [isFormSubmitting, setFormState] = useState(false);

  // Get user_id & JWT for http requests
  const loggedInUserData = useSelector((state) => {
    // if there's a user, that means user has logged in
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

  const onUpdateSubmit = async (e) => {
    e.preventDefault();
    if (newTodoDescription !== description) {
      setFormState(true);
      try {
        const resultAction = await dispatch(updateTodo({ ...todoRequestOptions, description: newTodoDescription }));
        unwrapResult(resultAction);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <li>
      <div className="flex justify-between">
        {isTodoFocus && !isFormSubmitting ? (
          <form
            onSubmit={(e) => {
              onUpdateSubmit(e);
              setTodoFocus(false);
              setFormState(false);
            }}
          >
            <label htmlFor={dndId}>
              <Input type="text" value={newTodoDescription} onChange={(e) => setNewTodoDescription(e.target.value)} />
            </label>

            {isTodoFocus && !isFormSubmitting && (
              <button
                className="mr-2"
                type="button"
                onClick={(e) => {
                  onUpdateSubmit(e);
                  setTodoFocus(false);
                  setFormState(false);
                }}
              >
                Done
              </button>
            )}
          </form>
        ) : (
          <p className="mb-3 mr-6">{description}</p>
        )}
        <div>
          <button className="mr-2" onClick={() => setTodoFocus(true)}>
            {!isTodoFocus && `Edit`}
          </button>
          <button onClick={() => handleTodoDeleteClick()}>Delete</button>
        </div>
      </div>
    </li>
  );
}

export default TodoRedux;
