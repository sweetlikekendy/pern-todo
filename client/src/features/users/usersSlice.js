import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";
import { ALL_USERS, LOGIN_URI, TODOLISTS_URI } from "../../endpoints";
import { normalize, schema } from "normalizr";

const usersAdapter = createEntityAdapter();

const initialState = usersAdapter.getInitialState({
  status: "idle",
  error: null,
});

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  try {
    const response = await axios.get(ALL_USERS);

    const { data: usersData } = response;
    // Define a users schema
    const user = new schema.Entity("users", {}, { idAttribute: "user_id" });
    const mySchema = { users: [user] };
    const normalizedData = normalize(usersData, mySchema);
    const { entities } = normalizedData;
    const { users } = entities;
    return users;
    // return data;
  } catch (error) {
    console.error(error);
    return error;
  }
});

export const loginUser = createAsyncThunk("users/loginUser", async ({ email, password }) => {
  try {
    const loginResponse = await axios.post(LOGIN_URI, {
      email,
      password,
    });

    const { data: loggedInUser } = loginResponse;

    // console.log(loggedInUser);
    const { id, token, loggedIn } = loggedInUser;

    if (loggedIn) {
      const todolistsResponse = await axios.get(TODOLISTS_URI(id), {
        headers: {
          Authorization: token,
        },
      });

      const { data: todolistData } = todolistsResponse;
      // console.log(todolistData);

      const allUserData = { ...loggedInUser, todolists: [...todolistData] };

      // console.log(allUserData);

      const todoSchema = new schema.Entity("todos", {}, { idAttribute: `id` });
      const todolistSchema = new schema.Entity("todolists", { todos: [todoSchema] }, { idAttribute: `id` });
      const user = new schema.Entity(`users`, { todolists: [todolistSchema] }, { idAttribute: "id" });

      const normalizedData = normalize(allUserData, user);
      // console.log(normalizedData);
      const { entities } = normalizedData;
      return entities;
    }
  } catch (error) {
    console.error(error);
    return error;
  }
});

// export const addNewUser = createAsyncThunk(
//   "posts/addNewUser",
//   async ({ firstName, lastName, email, password }, rejectWithValue) => {
//     try {
//       const response = await axios.post(REGISTER_URI, { firstName, lastName, email, password });
//       const { data } = response;
//       const { isCreated, message, duplicateEmail } = data;
//       // const response = await client.post("/fakeApi/posts", { post: initialPost });
//       if (isCreated) {
//         console.log(response);
//         return data;
//       }
//     } catch (error) {
//       console.log(error);
//       return rejectWithValue(error);
//     }
//   }
// );

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: {
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
      usersAdapter.upsertMany(state, action.payload.users);
    },
    [fetchUsers.fulfilled]: usersAdapter.setAll,

    // [addNewUser.pending]: (state, action) => {
    //   state.status = "loading";
    // },
    // [addNewUser.fulfilled]: usersAdapter.addOne,
    // [addNewUser.rejected]: (state, action) => {
    //   state.status = "failed";
    //   state.error = action.payload;
    // },
  },
});

export default usersSlice.reducer;

export const { selectAll: selectAllUsers, selectById: selectUserById } = usersAdapter.getSelectors(
  (state) => state.users
);
