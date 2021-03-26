import { configureStore } from "@reduxjs/toolkit";

import usersReducer from "../features/users/usersSlice";
import todolistsReducer from "../features/todolists/todolistsSlice";
import todosReducer from "../features/todos/todosSlice";

export default configureStore({
  reducer: {
    users: usersReducer,
    todolists: todolistsReducer,
    // todos: todosReducer,
  },
});
