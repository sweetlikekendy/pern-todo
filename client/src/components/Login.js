import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import axios from "axios";

const Login = ({
  userEmail,
  userFirstName,
  userLastName,
  jwt,
  isLoggedIn,
  setEmail,
  setFirstName,
  setLastName,
  setLoggedIn,
  setJwt,
}) => {
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const LOGIN_URI =
    process.env.NODE_ENV === `production`
      ? `some production uri`
      : `http://localhost:5000/api/login`;

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(LOGIN_URI, {
        email: formEmail,
        password: formPassword,
      })
      .then((response) => {
        console.log(response.data);
        const { loggedIn, message, redirect, token, user } = response.data;
        // console.log(loggedIn);
        if (loggedIn) {
          const { first_name, last_name, email } = user;
          setLoggedIn(loggedIn);
          setJwt(token);
          setStatusMessage(message);
          setFirstName(first_name);
          setLastName(last_name);
          setEmail(email);
          setRedirectUri(redirect);
        } else {
          setStatusMessage(message);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {isLoggedIn ? (
        <div>Hello, {userFirstName}! You're logged in!</div>
      ) : (
        <div>
          <p>Status: {statusMessage} </p>
          <form onSubmit={handleSubmit}>
            <label>
              email
              <input
                type="text"
                name="email"
                value={formEmail}
                onChange={(e) => {
                  setFormEmail(e.target.value);
                }}
              />
            </label>
            <label>
              password
              <input
                type="text"
                name="passw ord"
                value={formPassword}
                onChange={(e) => {
                  setFormPassword(e.target.value);
                }}
              />
            </label>
            <input type="submit" value="Log In" />
          </form>
          <p>Don't have an account? Register now</p>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

Login.propTypes = { isLoggedIn: PropTypes.bool };

export default Login;
