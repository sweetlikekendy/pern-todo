import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "@reach/router";
import { Button, Container, FormContainer, Form } from "../styles";
// todo change production uri
const REGISTER_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/register"
    : "something else";

const Register = ({ isLoggedIn }) => {
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const clearInputs = () => {
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(REGISTER_URI, {
        firstName: formFirstName,
        lastName: formLastName,
        email: formEmail,
        password: formPassword,
      })
      .then((res) => {
        const { isCreated, message } = res.data;
        console.log(res.data);
        if (isCreated) {
          setStatusMessage(message);
          clearInputs();
        } else {
          setStatusMessage(message);
        }
      })
      .catch((err) => console.error(err));
  };
  return (
    <Container>
      {isLoggedIn ? (
        <Redirect to="/" noThrow />
      ) : (
        <FormContainer>
          {statusMessage && <p className="mb-4">{statusMessage} </p>}
          <Form onSubmit={handleSubmit}>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formFirstName}
              onChange={(e) => setFormFirstName(e.target.value)}
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formLastName}
              onChange={(e) => setFormLastName(e.target.value)}
            />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
            />
            <Button isPrimary>Register</Button>
          </Form>
        </FormContainer>
      )}
    </Container>
  );
};

Register.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
};

export default Register;
