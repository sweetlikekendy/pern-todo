import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { CenterContainer, Container, Input, JustifyCenterHfullContainer, JustifyCenterContainer } from "../styles";
4;
import { addTodolist, selectTodolistIds } from "../features/todolists/todolistsSlice";
import TodolistListRedux from "./TodolistListRedux";
import LoginForm from "./LoginForm";

const Home = () => {
  const [newTodolist, setNewTodolist] = useState("");
  const [addTodolistStatus, setAddTodolistStatus] = useState("idle");

  const dispatch = useDispatch();

  const todolistIds = useSelector(selectTodolistIds);

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

  const canSave = [newTodolist].every(Boolean) && addTodolistStatus === "idle";

  const onCreateTodolistSubmit = async (e) => {
    e.preventDefault();
    if (canSave) {
      try {
        setAddTodolistStatus("pending");
        const resultAction = await dispatch(addTodolist({ userId, title: newTodolist, jwt }));
        unwrapResult(resultAction);
        setNewTodolist("");
      } catch (err) {
        setAddTodolistStatus("failed");
        console.error("Failed to save the post: ", err);
      } finally {
        setAddTodolistStatus("idle");
      }
    }
  };

  return (
    <Container>
      {isLoggedIn ? (
        <JustifyCenterHfullContainer>
          <JustifyCenterContainer>
            <div className="my-8" style={{ minWidth: "30%" }}>
              <h2 className="text-2xl mb-1 md:text-3xl lg:text-4xl">Hello, {firstName}</h2>
              <p className="mb-4">
                You have {numOfTodolists}
                {numOfTodolists === 1 ? <span> todolist</span> : <span> todolists</span>}
              </p>
              {/* <p className="mb-4">Todolist status: {addTodolistStatus}</p> */}
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
          <LoginForm />
        </CenterContainer>
      )}
    </Container>
  );
};

export default Home;
