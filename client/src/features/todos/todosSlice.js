import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { normalize, schema } from "normalizr";
// import { deleteTodo } from "../../components/Todo";
import { SINGLE_TODOLIST_URI, TODOLISTS_URI } from "../../endpoints";
// import normalize from "json-api-normalizer";
import { fetchTodolists } from "../todolists/todolistsSlice";

const todoAdapter = createEntityAdapter();

const initialState = todoAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const addTodo = createAsyncThunk("todolists/addTodo", async ({ userId, title, jwt }, rejectWithValue) => {
  try {
    const response = await axios.post(
      TODOLISTS_URI(userId),
      { title },
      {
        headers: {
          Authorization: jwt,
        },
      }
    );

    const { data: newTodolist } = response;

    return newTodolist;
  } catch (error) {
    console.log(error);
    return rejectWithValue(error);
  }
});

export const updateTodo = createAsyncThunk(
  "todolists/updateTodo",
  async ({ userId, todolistId, title, jwt }, rejectWithValue) => {
    try {
      const response = await axios.put(
        SINGLE_TODOLIST_URI(userId, todolistId),
        { title },
        {
          headers: {
            Authorization: jwt,
          },
        }
      );

      const { data: updatedTodolist } = response;

      return updatedTodolist;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todolists/deleteTodo",
  async ({ userId, todolistId, jwt }, rejectWithValue) => {
    try {
      // const deletedTodolist = await deleteTodo(jwt, userId, todolistId);
      const response = await axios.delete(SINGLE_TODOLIST_URI(userId, todolistId), {
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
      todoAdapter.removeOne(state, action.payload[0].id);
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
