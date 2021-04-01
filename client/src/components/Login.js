import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "@reach/router";
import axios from "axios";
import { Button, CenterContainer, CustomLink, Input, FormContainer } from "../styles";
// import { LOGIN_URI } from "../endpoints";

import { unwrapResult } from "@reduxjs/toolkit";
import { loginUser } from "../features/users/usersSlice";
import { useSelector, useDispatch } from "react-redux";
import LoginForm from "./LoginForm";

const Login = () => {
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const canSave = [formEmail, formPassword].every(Boolean) && addRequestStatus === "idle";

  // Used for single user in redux store
  const isLoggedIn = useSelector((state) => {
    // if there's a user, that means user has logged in
    if (state.users.ids.length > 0) {
      const { users } = state;
      const { ids, entities } = users;

      if (
        entities && // 👈 null and undefined check
        Object.keys(ids).length !== 0 &&
        entities[users.ids[0]]
      ) {
        const { loggedIn } = entities[users.ids[0]];
        return loggedIn;
      }
    }
  });

  const handleSubmit = async () => {
    if (canSave) {
      try {
        setAddRequestStatus("pending");
        const resultAction = await dispatch(loginUser({ email: formEmail, password: formPassword }));

        unwrapResult(resultAction);
        setFormEmail("");
        setFormPassword("");
      } catch (error) {
        setAddRequestStatus("failed");
        console.error("Failed to log in", error);
        console.log(error);
        setStatusMessage(error.message);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  return (
    <CenterContainer>
      {isLoggedIn ? (
        <Redirect to="/" noThrow />
      ) : (
        <FormContainer>
          {statusMessage && <p className="mb-4">{statusMessage} </p>}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
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
            <Button isPrimary marginBottom full disabled={!canSave}>
              Log In
            </Button>
          </form>
          <p className="mb-4 text-center">Don&apos;t have an account?</p>
          <CustomLink text="Register" linkTo="/register" isSecondary>
            Register
          </CustomLink>
        </FormContainer>
      )}
    </CenterContainer>
  );
};

Login.propTypes = { isLoggedIn: PropTypes.bool };

export default Login;
