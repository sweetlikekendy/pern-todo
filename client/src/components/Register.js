import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Link } from "@reach/router";

// todo change production uri
const REGISTER_URI =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/api/register"
    : "something else";

const Register = ({
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
    <div>
      {!isLoggedIn ? (
        <div>
          <p>Status: {statusMessage} </p>
          <form onSubmit={handleSubmit}>
            <label>
              First Name
              <input
                type="text"
                name="firstName"
                value={formFirstName}
                onChange={(e) => setFormFirstName(e.target.value)}
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                name="lastName"
                value={formLastName}
                onChange={(e) => setFormLastName(e.target.value)}
              />
            </label>
            <label>
              email
              <input
                type="text"
                name="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
              />
            </label>
            <label>
              password
              <input
                type="password"
                name="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
              />
            </label>
            <input type="submit" value="Register" />
          </form>
        </div>
      ) : (
        <div>
          <div>Hello, {userFirstName}! You're logged in!</div>
        </div>
      )}
    </div>
  );
};

Register.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
};

export default Register;
