import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  CenterContainer,
  Container,
  CustomLink,
  Input,
  JustifyCenterHfullContainer,
  JustifyCenterContainer,
  FormContainer,
  Button,
} from "../styles";
4;
import { addTodolist, selectTodolistIds } from "../features/todolists/todolistsSlice";
import TodolistListRedux from "./TodolistListRedux";
import LoginForm from "./LoginForm";
import { Link } from "@reach/router";
import { loginUser } from "../features/users/usersSlice";

const Home = () => {
  const [newTodolist, setNewTodolist] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const [formStatusMessage, setFormStatusMessage] = useState("");

  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [loginRequestStatus, setLoginRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const canSaveLogin = [formEmail, formPassword].every(Boolean) && loginRequestStatus === "idle";

  const loginStatus = useSelector((state) => state.users.status);
  const loginError = useSelector((state) => state.users.error);

  const handleLoginSubmit = async () => {
    if (canSaveLogin) {
      try {
        setLoginRequestStatus("pending");
        const resultAction = await dispatch(loginUser({ email: formEmail, password: formPassword }));

        unwrapResult(resultAction);
        setFormEmail("");
        setFormPassword("");
      } catch (error) {
        setLoginRequestStatus("failed");
        console.error("Failed to log in", error);
        console.log(error);
        setStatusMessage(error.message);
      } finally {
        setLoginRequestStatus("idle");
      }
    }
  };

  const todolistStatus = useSelector((state) => state.todolists.status);
  const todolistIds = useSelector(selectTodolistIds);
  const todolistError = useSelector((state) => state.todolists.error);

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
        setAddRequestStatus("failed");
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
              <p className="mb-4 ">
                You have {numOfTodolists}
                {numOfTodolists === 1 ? <span> todolist</span> : <span> todolists</span>}
              </p>
              <p className="mb-4">Todolist status: {todolistStatus}</p>
              <p className="mb-4">{todolistError && `Error: ${todolistError}`}</p>
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
          <FormContainer className="p-4">
            <p className="my-4">Login status: {loginStatus}</p>
            <p className="mb-4">{loginError && `Error: ${loginError}`}</p>
            {statusMessage && <p className="mb-4">{statusMessage} </p>}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleLoginSubmit();
              }}
            >
              <Input
                full
                border
                marginBottom
                type="text"
                name="email"
                placeholder="Email"
                value={formEmail}
                onChange={(e) => {
                  setFormEmail(e.target.value);
                }}
              />
              <Input
                full
                border
                marginBottom
                type="text"
                name="password"
                placeholder="Password"
                value={formPassword}
                onChange={(e) => {
                  setFormPassword(e.target.value);
                }}
              />
              <Button isPrimary marginBottom full disabled={!canSaveLogin}>
                Log In
              </Button>
            </form>
            <p className="mb-4 text-center">Don&apos;t have an account?</p>
            <CustomLink text="Register" linkTo="/register" isSecondary>
              Register
            </CustomLink>
          </FormContainer>
        </CenterContainer>
      )}
    </Container>
  );
};

export default Home;
