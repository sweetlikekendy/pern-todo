import React from "react";
import PropTypes from "prop-types";
import { Link } from "@reach/router";

import { StyledHeader } from "../../styles";

const Navbar = ({ isLoggedIn }) => {
  return (
    <StyledHeader className="App-header">
      <nav>
        <Link to="/">Home</Link>
        {isLoggedIn ? (
          <Link to="/logout">Log Out</Link>
        ) : (
          <Link to="/login">Log In</Link>
        )}
      </nav>
    </StyledHeader>
  );
};

Navbar.propTypes = {};

export default Navbar;
