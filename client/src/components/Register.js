import React, { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "@reach/router";
import { Button, CenterContainer, FormContainer, Input } from "../styles";

// todo change production uri
const REGISTER_URI = process.env.NODE_ENV === "development" ? "http://localhost:5000/api/register" : "something else";

const Register = ({ isLoggedIn }) => {
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const canSave = [formFirstName, formLastName, formEmail, formPassword].every(Boolean);

  const clearInputs = () => {
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormPassword("");
  };
  // const handleSubmit = async () => {
  //   if (canSave) {
  //     try {
  //       setAddRequestStatus("pending");
  //       const resultAction = await dispatch(
  //         addNewUser({ firstName: formFirstName, lastName: formLastName, email: formEmail, password: formPassword })
  //       );
  //       unwrapResult(resultAction);
  //       setFormFirstName("");
  //       setFormLastName("");
  //       setFormEmail("");
  //       setFormPassword("");
  //       // setStatusMessage(resultAction);
  //     } catch (err) {
  //       console.error("Failed to save the post: ", err);
  //       setAddRequestStatus("failed");
  //       // setStatusMessage(err);
  //     } finally {
  //       setAddRequestStatus("idle");
  //     }
  //   }
  // };

  const handleSubmit = async () => {
    try {
      const response = await axios.post(REGISTER_URI, {
        firstName: formFirstName,
        lastName: formLastName,
        email: formEmail,
        password: formPassword,
      });
      const { data } = response;
      const { isCreated, message } = data;
      if (isCreated) {
        clearInputs();
      }

      setStatusMessage(message);
    } catch (error) {
      console.err(error);
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
              name="firstName"
              placeholder="First Name"
              value={formFirstName}
              onChange={(e) => setFormFirstName(e.target.value)}
            />
            <Input
              full
              border
              marginBottom
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formLastName}
              onChange={(e) => setFormLastName(e.target.value)}
            />
            <Input
              full
              border
              marginBottom
              type="text"
              name="email"
              placeholder="Email"
              value={formEmail}
              onChange={(e) => setFormEmail(e.target.value)}
            />
            <Input
              full
              border
              marginBottom
              type="password"
              name="password"
              placeholder="Password"
              value={formPassword}
              onChange={(e) => setFormPassword(e.target.value)}
            />
            <Button full isPrimary disabled={!canSave}>
              Register
            </Button>
          </form>
        </FormContainer>
      )}
    </CenterContainer>
  );
};

Register.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  email: PropTypes.string,
  password: PropTypes.string,
};

export default Register;
