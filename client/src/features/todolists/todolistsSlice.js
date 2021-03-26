import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { normalize, schema } from "normalizr";
import { deleteTodo } from "../../components/Todo";
import { SINGLE_TODOLIST_URI, TODOLISTS_URI } from "../../endpoints";
// import normalize from "json-api-normalizer";

const todolistsAdapter = createEntityAdapter();

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

    // console.log(response);
    const { data: todolistData } = response;
    // console.log(todolistData);

    // const todoSchema = new schema.Entity("todos", undefined, { idAttribute: `id` });
    // const todolistSchema = new schema.Entity("todolists", { todos: todoSchema }, { idAttribute: `id` });
    const todolistSchema = new schema.Entity("todolists", undefined, { idAttribute: `id` });
    const todolistArraySchema = [todolistSchema];
    // const todoArraySchema = [todoSchema];
    // const todolistComplete = new schema.Entity("todolist", {
    //   todolists: todolistArraySchema,
    //   todos: todoArraySchema,
    // });

    // console.log(todolistComplete);

    const normalizedData = normalize(todolistData, todolistArraySchema);
    // const normalizedData = normalize(todolistData, todolistComplete);
    // console.log(normalizedData);
    const { entities } = normalizedData;
    const { todolists } = entities;

    return todolists;

    // return response;
    // console.log(data);
    // return data;
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
      console.log(error);
      return rejectWithValue(error);
    }
  }
);

export const updateTodolist = createAsyncThunk(
  "todolists/updateTodolist",
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
      console.log(updatedTodolist);
      return updatedTodolist;
    } catch (error) {
      console.log(error);
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
      console.log(error);
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
    [fetchTodolists.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchTodolists.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Add any fetched posts to the array
      todolistsAdapter.upsertMany(state, action.payload);
    },
    [addTodolist.pending]: (state, action) => {
      state.status = "loading";
    },
    [addTodolist.fulfilled]: todolistsAdapter.addOne,
    [addTodolist.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [updateTodolist.pending]: (state, action) => {
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
    [deleteTodolist.pending]: (state, action) => {
      state.status = "loading";
    },
    [deleteTodolist.fulfilled]: (state, action) => {
      state.status = "succeeded";
      todolistsAdapter.removeOne(state, action.payload[0].id);
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
