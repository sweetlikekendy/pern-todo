import { createSlice, createAsyncThunk, createEntityAdapter, createSelector } from "@reduxjs/toolkit";
import axios from "axios";
import { SINGLE_TODO_URI, TODOS_URI } from "../../endpoints";
import { DELETE_COMPLETED_TODO_URI, SET_TODOS_TO_COMPLETE } from "../../endpoints/endpoints";
import { fetchTodolists } from "../todolists/todolistsSlice";
import { loginUser } from "../users/usersSlice";

const todoAdapter = createEntityAdapter({
  selectId: (todo) => todo.id,
  sortComparer: (a, b) => Date.parse(b.created_at) - Date.parse(a.created_at),
});

const initialState = todoAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const addTodo = createAsyncThunk(
  "todos/addTodo",
  async ({ userId, todolistId, jwt, description }, { rejectWithValue }) => {
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
      console.error(error);
      return rejectWithValue(error);
    }
  }
);

export const updateTodo = createAsyncThunk("todos/updateTodo", async (updateTodoOptions, { rejectWithValue }) => {
  const { jwt, userId, todolistId, todoId, description, isComplete, options } = updateTodoOptions;

  try {
    const response = await axios.put(
      SINGLE_TODO_URI(userId, todolistId, todoId),
      { isComplete, description, options },
      {
        headers: {
          Authorization: jwt,
        },
      }
    );

    const { data: updatedTodo } = response;

    return updatedTodo;
  } catch (error) {
    console.error(error);
    return rejectWithValue(error);
  }
});

export const setMultipleTodosCompletionState = createAsyncThunk(
  "todos/setMultipleTodosCompletionState",
  async (updateTodosOptions, { rejectWithValue }) => {
    const { jwt, userId, todolistId, todoIds, setComplete } = updateTodosOptions;

    try {
      if (todoIds.length > 0) {
        const response = await axios.patch(
          SET_TODOS_TO_COMPLETE(userId, todolistId),
          { todoIds, setComplete },
          {
            headers: {
              Authorization: jwt,
            },
          }
        );

        const { data: updatedTodos } = response;

        return updatedTodos;
      }
      return [];
    } catch (error) {
      console.error(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteTodo = createAsyncThunk(
  "todos/deleteTodo",
  async ({ jwt, userId, todolistId, todoId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(SINGLE_TODO_URI(userId, todolistId, todoId), {
        headers: {
          Authorization: jwt,
        },
      });

      const { data: deletedTodo } = response;

      return deletedTodo;
    } catch (error) {
      console.error(error);
      return rejectWithValue(error);
    }
  }
);

export const deleteCompletedTodos = createAsyncThunk(
  "todos/deleteCompletedTodos",
  async ({ jwt, userId, todolistId, completeTodoIds }, { rejectWithValue }) => {
    try {
      if (completeTodoIds) {
        const response = await axios.delete(
          DELETE_COMPLETED_TODO_URI(userId, todolistId),

          {
            headers: {
              Authorization: jwt,
            },
            data: {
              completeTodoIds,
            },
          }
        );

        const { data: deletedTodos } = response;

        const returnIds = deletedTodos.map((todo) => todo.id);

        return returnIds;
      }
      return [];
    } catch (error) {
      console.error(error);
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
    [fetchTodolists.pending]: (state) => {
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
    [loginUser.pending]: (state) => {
      state.status = "loading";
    },
    [loginUser.fulfilled]: (state, action) => {
      state.status = "succeeded";

      if (action.payload) {
        // Add any fetched posts to the array
        if (action.payload.todos) {
          todoAdapter.upsertMany(state, action.payload.todos);
        }
      } else {
        (state) => initialState;
      }
    },
    [addTodo.pending]: (state) => {
      state.status = "loading";
    },
    [addTodo.fulfilled]: todoAdapter.addOne,
    [addTodo.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [updateTodo.pending]: (state) => {
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
    [setMultipleTodosCompletionState.pending]: (state) => {
      state.status = "loading";
    },
    [setMultipleTodosCompletionState.fulfilled]: (state, action) => {
      state.status = "succeeded";
      todoAdapter.upsertMany(state, action.payload);
    },
    [setMultipleTodosCompletionState.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    },
    [deleteTodo.pending]: (state) => {
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
    [deleteCompletedTodos.pending]: (state) => {
      state.status = "loading";
    },
    [deleteCompletedTodos.fulfilled]: (state, action) => {
      state.status = "succeeded";
      todoAdapter.removeMany(state, action.payload);
    },
    [deleteCompletedTodos.rejected]: (state, action) => {
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
