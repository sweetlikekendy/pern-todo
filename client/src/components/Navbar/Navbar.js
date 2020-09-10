import React from "react";
import PropTypes from "prop-types";

import { Header, CustomLink } from "../../styles";

const Navbar = ({ isLoggedIn }) => {
  return (
    <Header className="App-header">
      <nav className="flex justify-between">
        <CustomLink text="Home" linkTo="/" isNav />
        <div className="flex items-center">
          {isLoggedIn ? (
            <CustomLink text="Log Out" linkTo="/logout" isNav />
          ) : (
            <React.Fragment>
              <CustomLink text="Log In" linkTo="/login" isNav />
              <CustomLink text="Register" linkTo="/register" isNav />
            </React.Fragment>
          )}
        </div>
      </nav>
    </Header>
  );
};

Navbar.propTypes = {};

export default Navbar;
