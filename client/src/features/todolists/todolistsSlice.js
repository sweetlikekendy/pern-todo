import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { normalize, schema } from "normalizr";
import { deleteTodo } from "../../components/Todo";
import { SINGLE_TODOLIST_URI, TODOLISTS_URI } from "../../endpoints";
import { loginUser } from "../users/usersSlice";
// import normalize from "json-api-normalizer";

const todolistsAdapter = createEntityAdapter({
  selectId: (todolist) => todolist.id,
  sortComparer: (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
});

const initialState = todolistsAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchTodolists = createAsyncThunk("todolists/fetchTodolists", async ({ userId, jwt }) => {
  try {
    const response = await axios.get(TODOLISTS_URI(userId), {
      headers: {
        Authorization: jwt,
      },
    });

    const { data: todolistData } = response;

    const todoSchema = new schema.Entity("todos", {}, { idAttribute: `id` });
    const todolistSchema = new schema.Entity("todolists", { todos: [todoSchema] }, { idAttribute: `id` });
    const todolistArraySchema = [todolistSchema];

    const normalizedData = normalize(todolistData, todolistArraySchema);
    const { entities } = normalizedData;

    return entities;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const addTodolist = createAsyncThunk(
  "todolists/addTodolist",
  async ({ userId, title, jwt }, rejectWithValue) => {
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
      console.error(error);
      return rejectWithValue(error);
    }
  }
);

export const updateTodolist = createAsyncThunk(
  "todolists/updateTodolist",
  async ({ userId, todolistId, jwt, title }, rejectWithValue) => {
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
      console.error(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteTodolist = createAsyncThunk(
  "todolists/deleteTodolist",
  async ({ userId, todolistId, jwt }, rejectWithValue) => {
    try {
      // const deletedTodolist = await deleteTodolist(jwt, userId, todolistId);
      const response = await axios.delete(SINGLE_TODOLIST_URI(userId, todolistId), {
        headers: {
          Authorization: jwt,
        },
      });

      const { data: deletedTodolist } = response;

      return deletedTodolist;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error);
    }
  }
);

const todolistsSlice = createSlice({
  name: "todolists",
  initialState,
  reducers: {},
  extraReducers: {
    [fetchTodolists.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [fetchTodolists.pending]: (state) => {
      state.status = "loading";
    },
    [fetchTodolists.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the array
      console.log("todolistsSlice", action);
      todolistsAdapter.upsertMany(state, action.payload.todolists);
    },
    [loginUser.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [loginUser.pending]: (state) => {
      state.status = "loading";
    },
    [loginUser.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the array

      if (action.payload.todolists) {
        todolistsAdapter.upsertMany(state, action.payload.todolists);
      } else {
        (state) => initialState;
      }
    },
    [addTodolist.pending]: (state) => {
      state.status = "loading";
    },
    [addTodolist.fulfilled]: todolistsAdapter.addOne,
    [addTodolist.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [updateTodolist.pending]: (state) => {
      state.status = "loading";
    },
    [updateTodolist.fulfilled]: (state, action) => {
      state.status = "succeeded";
      const { id } = action.payload;

      todolistsAdapter.updateOne(state, {
        id: `${id}`,
        changes: action.payload,
      });
    },
    [updateTodolist.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [deleteTodolist.pending]: (state) => {
      state.status = "loading";
    },
    [deleteTodolist.fulfilled]: (state, action) => {
      state.status = "succeeded";
      todolistsAdapter.removeOne(state, action.payload.id);
    },
    [deleteTodolist.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
  },
});

export default todolistsSlice.reducer;

export const {
  selectAll: selectAllTodolists,
  selectById: selectTodolistById,
  selectIds: selectTodolistIds,
} = todolistsAdapter.getSelectors((state) => state.todolists);

export const selectTodolistsByUser = createSelector(
  [selectAllTodolists, (state, userId) => userId],
  (todolists, userId) => todolists.filter((todolist) => todolist.user === userId)
);
