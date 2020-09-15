import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { Redirect } from "@reach/router";

const Logout = ({
  isLoggedIn,
  setEmail,
  setFirstName,
  setLastName,
  setLoggedIn,
  setUserId,
  setJwt,
  setPersistedData,
}) => {
  // TODO confirm the logout with a modal
  const logout = () => {
    if (isLoggedIn) {
      setLoggedIn(false);
      setFirstName("");
      setLastName("");
      setEmail("");
      setJwt("");
      setUserId("");
      setPersistedData({});
    }
  };

  useEffect(() => {
    logout();
  }, [isLoggedIn]);

  return (
    <div>
      {isLoggedIn ? (
        <p>You're already logged in!</p>
      ) : (
        <Redirect to="/" noThrow />
      )}
    </div>
  );
};

Logout.propTypes = {};

export default Logout;
