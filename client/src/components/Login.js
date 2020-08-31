import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "@reach/router";
import axios from "axios";
import StyledForm from "../styles";
import { LOGIN_URI } from "../endpoints";

const Login = ({
  isLoggedIn,
  setEmail,
  setFirstName,
  setLastName,
  setUserId,
  setLoggedIn,
  setJwt,
  setFetching,
}) => {
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios
      .post(LOGIN_URI, {
        email: formEmail,
        password: formPassword,
      })
      .then((response) => {
        const { loggedIn, message, token, user } = response.data;

        if (loggedIn) {
          const { first_name, last_name, email, id } = user;
          setLoggedIn(loggedIn);
          setJwt(token);
          setStatusMessage(message);
          setFirstName(first_name);
          setLastName(last_name);
          setUserId(id);
          setEmail(email);
          setFetching(true);
        } else {
          setStatusMessage(message);
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <div>
      {isLoggedIn ? (
        <Redirect to="/" noThrow />
      ) : (
        <div>
          <p>Status: {statusMessage} </p>
          <StyledForm>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formEmail}
                onChange={(e) => {
                  setFormEmail(e.target.value);
                }}
              />
              <input
                type="text"
                name="password"
                placeholder="Password"
                value={formPassword}
                onChange={(e) => {
                  setFormPassword(e.target.value);
                }}
              />
              <button>Log In</button>
            </form>
          </StyledForm>
          <p>Don't have an account? Register now</p>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

Login.propTypes = { isLoggedIn: PropTypes.bool };

export default Login;
