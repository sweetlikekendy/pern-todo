import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { SINGLE_TODO_URI, TODOS_URI } from "../../endpoints";
import { fetchTodolists } from "../todolists/todolistsSlice";
import { loginUser } from "../users/usersSlice";

const todoAdapter = createEntityAdapter();

const initialState = todoAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async ({ userId, todolistId, jwt, description }, rejectWithValue) => {
    try {
      const response = await axios.post(
        TODOS_URI(userId, todolistId),
        { description },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );

      const { data: newTodo } = response;

      return newTodo;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const updateTodo = createAsyncThunk(
  "todos/updateTodo",
  async ({ jwt, userId, todolistId, todoId, description }, rejectWithValue) => {
    try {
      const response = await axios.put(
        SINGLE_TODO_URI(userId, todolistId, todoId),
        { description },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );

      const { data: updatedTodo } = response;

      return updatedTodo;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async ({ jwt, userId, todolistId, todoId }, rejectWithValue) => {
    try {
      const response = await axios.delete(SINGLE_TODO_URI(userId, todolistId, todoId), {
        headers: {
          Authorization: jwt,
        },
      });

      const { data: deletedTodolist } = response;

      return deletedTodolist;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

const todosSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchTodolists.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [fetchTodolists.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchTodolists.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the array
      todoAdapter.upsertMany(state, action.payload.todos);
    },
    [loginUser.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [loginUser.pending]: (state, action) => {
      state.status = "loading";
    },
    [loginUser.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the array
      todoAdapter.upsertMany(state, action.payload.todos);
    },
    [addTodo.pending]: (state, action) => {
      state.status = "loading";
    },
    [addTodo.fulfilled]: todoAdapter.addOne,
    [addTodo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [updateTodo.pending]: (state, action) => {
      state.status = "loading";
    },
    [updateTodo.fulfilled]: (state, action) => {
      state.status = "succeeded";
      const { id } = action.payload;

      todoAdapter.updateOne(state, {
        id: `${id}`,
        changes: action.payload,
      });
    },
    [updateTodo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [deleteTodo.pending]: (state, action) => {
      state.status = "loading";
    },
    [deleteTodo.fulfilled]: (state, action) => {
      state.status = "succeeded";
      todoAdapter.removeOne(state, action.payload.id);
    },
    [deleteTodo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export default todosSlice.reducer;

export const {
  selectAll: selectAllTodos,
  selectById: selectTodoById,
  selectIds: selectTodoIds,
} = todoAdapter.getSelectors((state) => state.todos);

export const selectTodosByTodolist = createSelector(
  [selectAllTodos, (state, todolistId) => todolistId],
  (todos, todolistId) => todos.filter((todo) => todo.todolist_id === todolistId)
);
