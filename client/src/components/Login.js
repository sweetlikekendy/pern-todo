import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";
import axios from "axios";

const Login = ({
  userEmail,
  userFirstName,
  userLastName,
  userPassword,
  isLoggedIn,
  setEmail,
  setFirstName,
  setLastName,
  setPassword,
  setLoggedIn,
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
      .then((res) => {
        console.log(res.data);
        const { loggedIn, message, redirect, token, user } = res.data;
        // console.log(loggedIn);
        if (loggedIn) {
          const { first_name, last_name, email } = user;
          setLoggedIn(loggedIn);
          localStorage.setItem(`Authorization`, token);
          setStatusMessage(message);
          setFirstName(first_name);
          setLastName(last_name);
          setEmail(email);
          setRedirectUri(redirect);
        } else {
          setStatusMessage(message);
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <div>
      {!isLoggedIn ? (
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
      ) : (
        <div>Hello, {userFirstName}! You're logged in!</div>
      )}
    </div>
  );
};

Login.propTypes = { isLoggedIn: PropTypes.bool };

export default Login;
