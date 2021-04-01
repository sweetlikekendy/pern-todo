import { unwrapResult } from "@reduxjs/toolkit";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../features/users/usersSlice";
import { Button, CustomLink, FormContainer, Input } from "../styles";

export default function LoginForm() {
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const [addRequestStatus, setAddRequestStatus] = useState("idle");

  const dispatch = useDispatch();

  const canSave = [formEmail, formPassword].every(Boolean) && addRequestStatus === "idle";

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
  );
}
