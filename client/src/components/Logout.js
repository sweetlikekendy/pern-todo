import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Logout = ({
  isLoggedIn,
  setEmail,
  setFirstName,
  setLastName,
  setLoggedIn,
  setJwt,
  setNumOfTodolists,
  setNumOfTodos,
  setTodolists,
  setTodos,
}) => {
  const logout = () => {
    setLoggedIn(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setJwt("");
    setNumOfTodolists(0);
    setNumOfTodos(0);
    setTodolists("");
    setTodos("");
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
