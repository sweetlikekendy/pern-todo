import React, { useState } from "react";
import PropTypes from "prop-types";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { selectAllUsers } from "../features/users/usersSlice";
import {
  deleteCompletedTodos,
  selectTodosByTodolist,
  setMultipleTodosCompletionState,
} from "../features/todos/todosSlice";

import { AiOutlineClear } from "react-icons/ai";
import { BiCheckboxChecked, BiCheckbox } from "react-icons/bi";
import { FiTrash2 } from "react-icons/fi";
import DeleteTodolistConfirmationModal from "./DeleteTodolistConfirmationModal";

export default function TodolistMenu({ todolistId }) {
  const dispatch = useDispatch();
  const users = useSelector((state) => selectAllUsers(state));
  const todosInCurrentTodolist = useSelector((state) => selectTodosByTodolist(state, todolistId));

  const [isConfirmationDelete, setDeleteConfirmation] = useState(false);

  const { id: userId } = users[0];

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

  let completeTodoIds = [];
  let incompleteTodoIds = [];

  if (todosInCurrentTodolist.length > 0) {
    todosInCurrentTodolist.map((todo) => {
      const { id, isComplete } = todo;

      if (isComplete) {
        completeTodoIds.push(id);
      } else {
        incompleteTodoIds.push(id);
      }
    });
  }

  const handleSetAllTodosToComplete = async () => {
    try {
      const setAllTodosToCompleteAction = await dispatch(
        setMultipleTodosCompletionState({ jwt, userId, todolistId, todoIds: incompleteTodoIds, setComplete: true })
      );

      unwrapResult(setAllTodosToCompleteAction);
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleSetAllCompletedTodosToIncomplete = async () => {
    try {
      if (completeTodoIds.length > 0) {
        const setAllCompleteTodosToIncompleteAction = await dispatch(
          setMultipleTodosCompletionState({ jwt, userId, todolistId, todoIds: completeTodoIds, setComplete: false })
        );
        unwrapResult(setAllCompleteTodosToIncompleteAction);
      }
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleDeleteAllCompletedTodos = async () => {
    try {
      if (completeTodoIds.length > 0) {
        const deleteAllCompletedTodosAction = await dispatch(
          deleteCompletedTodos({ jwt, userId, todolistId, completeTodoIds })
        );
        unwrapResult(deleteAllCompletedTodosAction);
      }
      return;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <div className="flex justify-evenly px-2 py-2 text-sm text-blueGray-400 bg-blueGray-100">
      {isConfirmationDelete && (
        <DeleteTodolistConfirmationModal todolistId={todolistId} setModalState={setDeleteConfirmation} />
      )}
      <MenuButton title="Set all as complete" onClick={() => handleSetAllTodosToComplete()}>
        <BiCheckboxChecked className="h-7 w-7" />
      </MenuButton>
      <MenuButton title="Set all as incomplete" onClick={() => handleSetAllCompletedTodosToIncomplete()}>
        <BiCheckbox className="h-7 w-7" />
      </MenuButton>
      <MenuButton title="Clear completed todos" onClick={() => handleDeleteAllCompletedTodos()}>
        <AiOutlineClear className="h-6 w-6" />
      </MenuButton>
      <MenuButton title="Delete todolist" onClick={() => setDeleteConfirmation(true)}>
        <FiTrash2 className="h-5 w-5" />
      </MenuButton>
    </div>
  );
}

TodolistMenu.propTypes = {
  todolistId: PropTypes.number,
};

export const MenuButton = ({ children, ...rest }) => (
  <button className="transition-color hover:text-blueGray-600" {...rest}>
    {children}
  </button>
);

MenuButton.propTypes = {
  children: PropTypes.node,
};
