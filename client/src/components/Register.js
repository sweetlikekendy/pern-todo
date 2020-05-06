import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "@reach/router";

// todo change production uri
const REGISTER_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/register"
    : "something else";

const Register = ({
  firstName,
  lastName,
  email,
  password,
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
}) => {
  const clearInputs = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(REGISTER_URI, { firstName, lastName, email, password })
      .then((res) => {
        console.log(res.data);
        clearInputs();
      })
      .catch((err) => console.error(err));
  };
  return (
    <form onSubmit={handleSubmit}>
      <label>
        First Name
        <input
          type="text"
          name="firstName"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </label>
      <label>
        Last Name
        <input
          type="text"
          name="lastName"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </label>
      <label>
        email
        <input
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </label>
      <label>
        password
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <input type="submit" value="Register" />
    </form>
  );
};

Register.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
};

export default Register;
