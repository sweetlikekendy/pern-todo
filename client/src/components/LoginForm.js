import React, { useEffect, useRef, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/users/usersSlice";
import { Button, CustomLink, FormContainer, Input } from "../styles";

export default function LoginForm() {
  const dispatch = useDispatch();
  const _isMounted = useRef(true);
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const loginError = useSelector((state) => state.users.error);

  const [loginStatus, setLoginStatus] = useState("idle");

  const canSave = [formEmail, formPassword].every(Boolean) && loginStatus === "idle";

  useEffect(() => {
    return () => {
      _isMounted.current = false;
      setFormPassword("");
      setFormEmail("");
      setLoginStatus("idle");
    };
  }, []);

  const handleSubmit = async () => {
    if (canSave && _isMounted.current) {
      try {
        setLoginStatus("pending");
        const resultAction = await dispatch(loginUser({ email: formEmail, password: formPassword }));
        unwrapResult(resultAction);
      } catch (error) {
        setLoginStatus("failed");
        console.error("Failed to log in", error);
        console.log(error);
        setLoginStatus("idle");
      }
    }
  };

  return (
    <FormContainer>
      {/* <p className="mb-4">Login Form State: {loginStatus}</p> */}
      {loginError && <p className="mb-4">Error: {loginError}</p>}

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
          type="password"
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
