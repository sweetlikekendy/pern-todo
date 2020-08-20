import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Logout = ({
  isLoggedIn,
  setEmail,
  setFirstName,
  setLastName,
  setLoggedIn,
  setUserId,
  setJwt,
  setTodolists,
  setPersistedData,
}) => {
  const logout = () => {
    setLoggedIn(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setJwt("");
    setUserId("");
    setTodolists([]);
    setPersistedData({});
  };

  useEffect(() => {
    logout();
  }, [isLoggedIn]);

  return (
    <div>{isLoggedIn ? <p>Logging Out</p> : <p>You're not logged in</p>}</div>
  );
};

Logout.propTypes = {};

export default Logout;
