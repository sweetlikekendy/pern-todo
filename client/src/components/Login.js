import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link, Redirect } from "@reach/router";
import axios from "axios";
import {
  Button,
  CenterContainer,
  CustomLink,
  Input,
  FormContainer,
} from "../styles";
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
    <CenterContainer>
      {isLoggedIn ? (
        <Redirect to="/" noThrow />
      ) : (
        <FormContainer>
          {statusMessage && <p className="mb-4">{statusMessage} </p>}
          <form onSubmit={handleSubmit}>
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
            <Button isPrimary marginBottom full>
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
