import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  CenterContainer,
  Container,
  CustomLink,
  Input,
  JustifyCenterHfullContainer,
  JustifyCenterContainer,
} from "../styles";

import TodolistRedux from "./TodolistRedux";
import { fetchTodolists, addTodolist, selectTodolistIds } from "../features/todolists/todolistsSlice";
import TodolistListRedux from "./TodolistListRedux";

const Home = ({
  // firstName,
  // userId,
  // isLoggedIn,
  // jwt,
  fetching,
  // setFetching,
  // setPersistedData,
  // stateData,
  // setStateData,
}) => {
  const [newTodolist, setNewTodolist] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  // const { data, todolistOrder } = stateData;
  // const { numOfTodolists, todolists } = data;

  const dispatch = useDispatch();
  // const orderedTodolistIds = useSelector(selectTodolistIds);
  const todolistStatus = useSelector((state) => state.todolists.status);
  const todolistIds = useSelector(selectTodolistIds);
  const error = useSelector((state) => state.todolists.error);

  // Used for single user in redux store
  const loggedInUserData = useSelector((state) => {
    const todolistsData =
      state.todolists.ids.length > 0 ? { todolists: state.todolists.entities, ids: state.todolists.ids } : {};

    // if there's a user, that means user has logged in
    if (state.users.ids.length > 0) {
      const { users } = state;
      const { ids: userIds, entities: userEntities } = users;
      const { first_name, id, loggedIn, token } = userEntities[userIds[0]];

      return { first_name, id, loggedIn, token, todolistsData };
    }
    return { first_name: ``, id: null, loggedIn: false, token: ``, todolistsData };
  });

  const { id: userId, loggedIn: isLoggedIn, first_name: firstName, token: jwt, todolistsData } = loggedInUserData;

  useEffect(() => {
    if (todolistStatus === "idle") {
      if (isLoggedIn) {
        console.log(`${firstName} is logged in! fetching todolists`);
        console.log(`Home userId and jwt`, userId, jwt);

        const resultAction = dispatch(fetchTodolists({ userId, jwt }));
        unwrapResult(resultAction);
      }
    }
  }, [todolistStatus, dispatch, firstName, userId, jwt, isLoggedIn]);

  let numOfTodolists = 0;

  if (todolistIds.length > 0) {
    numOfTodolists = todolistIds.length;
  }

  const canSave = [newTodolist].every(Boolean) && addRequestStatus === "idle";

  const addTodolistOnKeyPress = async (event) => {
    const { key } = event;

    if (key === "Enter" && canSave) {
      // addTodolist(jwt, userId, newTodolist, setNewTodolist);
      try {
        setAddRequestStatus("pending");
        const resultAction = await dispatch(addTodolist({ userId, title: newTodolist, jwt }));

        unwrapResult(resultAction);
        setNewTodolist("");
      } catch (err) {
        console.error("Failed to save the post: ", err);
      } finally {
        setAddRequestStatus("idle");
      }

      // setFetching(true)
    }
  };
  // let content;

  // if (todolistStatus === "loading") {
  //   content = <div className="loader">Loading...</div>;
  // } else if (todolistStatus === "succeeded") {
  //   content = orderedTodolistIds.map((todolistId) => <div key={todolistId}>{todolistId}</div>);
  // } else if (todolistStatus === "error") {
  //   content = <div>{error}</div>;
  // }

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (isLoggedIn) {
  //       console.log(`fetching data`);
  //       // new stuff with react beautiful dnd and state
  //       await axios
  //         .get(TODOLISTS_URI(userId), {
  //           headers: {
  //             Authorization: jwt,
  //           },
  //         })
  //         .then(async (response) => {
  //           const { data } = response;

  //           await setPersistedData({ data });
  //           await setStateData({ data });
  //         })
  //         .catch((error) => console.error(error.response.request));
  //     }
  //   };

  //   if (fetching) {
  //     fetchData();
  //     setFetching(false);
  //   }
  // }, [isLoggedIn, jwt, setPersistedData, setStateData, userId, fetching, setFetching]);

  return (
    <Container>
      {isLoggedIn ? (
        <JustifyCenterHfullContainer>
          <JustifyCenterContainer>
            <div className="my-8" style={{ minWidth: "30%" }}>
              <h2>Hello, {firstName}</h2>
              <p className="mb-4">
                You have {numOfTodolists}
                {numOfTodolists === 1 ? <span> todolist</span> : <span> todolists</span>}
              </p>
              <Input
                full
                border
                type="text"
                name="title"
                value={newTodolist}
                placeholder="Enter todolist title here"
                onChange={(e) => setNewTodolist(e.target.value)}
                onKeyPress={(e) => addTodolistOnKeyPress(e)}
              />
            </div>
          </JustifyCenterContainer>
          <TodolistListRedux />
          {/* <Todolists
            // todolistOrder={todolistOrder}
            // todolists={todolists}
            jwt={jwt}
            userId={userId}
            // setFetching={setFetching}
            // stateData={stateData}
            // setPersistedData={setPersistedData}
          /> */}
        </JustifyCenterHfullContainer>
      ) : (
        <CenterContainer>
          <p>
            Not logged in. Click <CustomLink text="here" linkTo="/login" /> to login
          </p>
        </CenterContainer>
      )}
    </Container>
  );
};

Home.propTypes = {};

export default Home;
