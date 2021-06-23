import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { Redirect } from "@reach/router";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Button, CenterContainer, CustomLink, FormContainer, Input, Label } from "../styles";

// todo change production uri
const REGISTER_URI =
  process.env.NODE_ENV === `production`
    ? `${process.env.REACT_APP_API_URL}/api/register`
    : `http://localhost:5000/api/register`;

const Register = ({ isLoggedIn }) => {
  const [formFirstName, setFormFirstName] = useState("");
  const [formLastName, setFormLastName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [isCreatedSuccessfully, setCreateUserState] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const _isMounted = useRef(true);

  const canSave = [formFirstName, formLastName, formEmail, formPassword].every(Boolean);

  useEffect(() => {
    return () => {
      _isMounted.current = false;
      setFormPassword("");
      setFormEmail("");
      setLoading(false);
    };
  }, []);

  const clearInputs = () => {
    setFormFirstName("");
    setFormLastName("");
    setFormEmail("");
    setFormPassword("");
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (_isMounted.current) {
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
          setCreateUserState(true);
        }

        setStatusMessage(message);
        setLoading(false);
      } catch (error) {
        console.err(error);
        setLoading(false);
        throw error;
      }
    }
  };

  if (isLoggedIn) return <Redirect to="/" noThrow />;
  if (isCreatedSuccessfully) return <Redirect to="/register-success" noThrow />;

  return (
    <CenterContainer>
      <FormContainer>
        {statusMessage && <p className="mb-4 text-red-500">{statusMessage} </p>}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="mb-4">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              full
              border
              type="text"
              name="firstName"
              value={formFirstName}
              onChange={(e) => setFormFirstName(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              full
              border
              type="text"
              name="lastName"
              value={formLastName}
              onChange={(e) => setFormLastName(e.target.value)}
            />
          </div>
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
            <Button isPrimary full disabled>
              <AiOutlineLoading3Quarters className="animate-spin h-4 w-4 mr-4" />
              Making an account...
            </Button>
          ) : (
            <Button full isPrimary disabled={!canSave}>
              Register
            </Button>
          )}
        </form>
        <hr className="my-4 text-gray-900" />
        <p className="mb-4 text-center ">Already registered?</p>
        <CustomLink text="Login" linkTo="/login" isSecondary />
      </FormContainer>
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
