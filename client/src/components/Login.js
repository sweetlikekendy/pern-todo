import React from "react";
import PropTypes from "prop-types";
import { Redirect } from "@reach/router";
import { CenterContainer } from "../styles";

import { useSelector } from "react-redux";
import LoginForm from "./LoginForm";

const Login = () => {
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

  return <CenterContainer>{isLoggedIn ? <Redirect to="/" noThrow /> : <LoginForm />}</CenterContainer>;
};

Login.propTypes = { isLoggedIn: PropTypes.bool };

export default Login;
