import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

const handleSubmit = () => {
  alert("Inside handle submit");
};

const Login = ({ isLoggedIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <div>
      {isLoggedIn ? (
        <div>Log Out</div>
      ) : (
        <div>
          <form onSubmit={handleSubmit}>
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
                type="text"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <input type="submit" value="Log In" />
          </form>
          <p>Don't have an account? Register now</p>
          <Link to="/register">Register</Link>
        </div>
      )}
    </div>
  );
};

Login.propTypes = { isLoggedIn: PropTypes.bool };

export default Login;
