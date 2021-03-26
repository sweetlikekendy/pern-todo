import React from "react";
import PropTypes from "prop-types";

import { Header, CustomLink } from "../../styles";
import { useSelector } from "react-redux";

const Navbar = () => {
  const isLoggedIn = useSelector((state) => {
    // if there's a user, that means user has logged in
    if (state.users.ids.length > 0) {
      const { users } = state;
      const { ids, entities } = users;

      if (
        entities && // 👈 null and undefined check
        Object.keys(ids).length !== 0 &&
        entities[users.ids[0]]
      ) {
        const { loggedIn } = entities[users.ids[0]];
        return loggedIn;
      }
    }
  });

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
