import React, { useEffect, useRef, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/users/usersSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button, CustomLink, FormContainer, Input, Label } from "../styles";
import "twin.macro";

export default function LoginForm() {
  const dispatch = useDispatch();
  const _isMounted = useRef(true);
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const loginError = useSelector((state) => state.users.error);
  const [isLoading, setLoading] = useState(false);

  const canSave = [formEmail, formPassword].every(Boolean);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
      setFormPassword("");
      setFormEmail("");
    };
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    if (canSave && _isMounted.current) {
      try {
        const resultAction = await dispatch(loginUser({ email: formEmail, password: formPassword }));
        unwrapResult(resultAction);
      } catch (error) {
        console.error("Failed to log in", error);
        console.log(error);
      }
    }
    setLoading(false);
  };

  return (
    <FormContainer>
      {loginError && <p className="mb-4">Error: {loginError}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <div className="mb-4">
          <Label htmlFor="email">Email</Label>
          <Input
            full
            border
            type="text"
            name="email"
            value={formEmail}
            onChange={(e) => setFormEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            full
            border
            type="password"
            name="password"
            value={formPassword}
            onChange={(e) => setFormPassword(e.target.value)}
          />
        </div>
        {isLoading ? (
          <Button isPrimary marginBottom full disabled>
            <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-4" />
            Logging In...
          </Button>
        ) : (
          <Button isPrimary marginBottom full disabled={!canSave}>
            Log In
          </Button>
        )}
      </form>
      <p className="mb-4 text-center">Don&apos;t have an account?</p>
      <CustomLink text="Register" linkTo="/register" isSecondary>
        Register
      </CustomLink>
    </FormContainer>
  );
}
