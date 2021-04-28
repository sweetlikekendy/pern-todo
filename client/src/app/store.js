import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import usersReducer from "../features/users/usersSlice";
import todolistsReducer from "../features/todolists/todolistsSlice";
import todosReducer from "../features/todos/todosSlice";

const combinedReducer = combineReducers({
  users: usersReducer,
  todolists: todolistsReducer,
  todos: todosReducer,
});

const rootReducer = (state, action) => {
  if (action.type === "users/logout") {
    state = undefined;
  }
  return combinedReducer(state, action);
};

export default configureStore({
  reducer: rootReducer,
  middleware: [...getDefaultMiddleware()],
});
