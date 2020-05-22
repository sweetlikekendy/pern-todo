import React, { useEffect } from "react";
import PropTypes from "prop-types";

const Logout = ({
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
  const reset = () => {
    setLoggedIn(false);
    setFirstName(userFirstName);
    setLastName(userLastName);
    setEmail(userEmail);
  };
  useEffect(() => {
    reset();
    return () => {
      reset();
    };
  }, []);
  return <div>Logging Out</div>;
};

Logout.propTypes = {};

export default Logout;
