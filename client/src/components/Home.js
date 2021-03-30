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

const Home = () => {
  const [newTodolist, setNewTodolist] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [formStatusMessage, setFormStatusMessage] = useState("");

  const dispatch = useDispatch();

  const todolistStatus = useSelector((state) => state.todolists.status);
  const todolistIds = useSelector(selectTodolistIds);
  const error = useSelector((state) => state.todolists.error);

  // User Data used for conditional formatting and http requests
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

  const { id: userId, loggedIn: isLoggedIn, first_name: firstName, token: jwt } = loggedInUserData;

  let numOfTodolists = 0;

  if (todolistIds.length > 0) {
    numOfTodolists = todolistIds.length;
  }

  const canSave = [newTodolist].every(Boolean) && addRequestStatus === "idle";

  // const addTodolistOnKeyPress = async (event) => {
  //   const { key } = event;

  //   if (key === "Enter" && canSave) {
  //     try {
  //       setAddRequestStatus("pending");
  //       const resultAction = await dispatch(addTodolist({ userId, title: newTodolist, jwt }));

  //       unwrapResult(resultAction);
  //       setNewTodolist("");
  //     } catch (err) {
  //       console.error("Failed to save the post: ", err);
  //     } finally {
  //       setAddRequestStatus("idle");
  //     }
  //   }
  // };

  const onCreateTodolistSubmit = async (e) => {
    e.preventDefault();

    if (canSave) {
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
    }
  };

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
              <form onSubmit={(e) => onCreateTodolistSubmit(e)}>
                <Input
                  full
                  border
                  type="text"
                  name="title"
                  value={newTodolist}
                  placeholder="Enter todolist title here"
                  onChange={(e) => setNewTodolist(e.target.value)}
                />
              </form>
            </div>
          </JustifyCenterContainer>
          <TodolistListRedux />
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

export default Home;
