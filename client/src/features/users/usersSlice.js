import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";
import { LOGIN_URI, TODOLISTS_URI } from "../../endpoints";
import { normalize, schema } from "normalizr";

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const todoSchema = new schema.Entity("todos", {}, { idAttribute: `id` });
export const todolistSchema = new schema.Entity("todolists", { todos: [todoSchema] }, { idAttribute: `id` });
export const user = new schema.Entity(`users`, { todolists: [todolistSchema] }, { idAttribute: "id" });

export const loginUser = createAsyncThunk("users/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const loginResponse = await axios.post(LOGIN_URI, {
      email,
      password,
    });

    const { data: userData } = loginResponse;
    const { id, token, loggedIn } = userData;

    if (loggedIn) {
      // if (userData.todolists) {
      const todolistsResponse = await axios.get(TODOLISTS_URI(id), {
        headers: {
          Authorization: token,
        },
      });

      let { data: todolistData } = todolistsResponse;

      if (todolistData == null) {
        todolistData = {};
      }
      // if (todolistData.length > 0) {
      const allUserData = { ...userData, todolists: [...todolistData] };

      const normalizedData = normalize(allUserData, user);
      const { entities } = normalizedData;
      return entities;
    }
    return rejectWithValue(userData.message);
  } catch (error) {
    console.error(error);
    return rejectWithValue(error);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    logout: (state) => {
      // From here we can take action only at this "counter" state
      // But, as we have taken care of this particular "logout" action
      // in rootReducer, we can use it to CLEAR the complete Redux Store's state
    },
  },
  extraReducers: {
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
      if (!action.payload.users) {
        (state) => initialState;
      } else {
        usersAdapter.upsertMany(state, action.payload.users);
      }
    },
  },
});

export const { logout } = usersSlice.actions;

export default usersSlice.reducer;

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(
  (state) => state.users
);
