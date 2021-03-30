import React, { useState } from "react";
import PropTypes from "prop-types";

import { Header, CustomLink } from "../../styles";
import { useSelector } from "react-redux";
import LogoutModal from "../LogoutModal";

const Navbar = () => {
  const [isLogOutModalOpen, setModalState] = useState(false);
  // Get log in status of user
  const isLoggedIn = useSelector((state) => {
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

  const handleLogOutModalClick = () => {
    setModalState(true);
  };

  return (
    <Header className="App-header">
      <nav className="flex justify-between">
        <CustomLink text="Home" linkTo="/" isNav />
        <div className="flex items-center">
          {isLoggedIn ? (
            <button onClick={() => handleLogOutModalClick()}>LOG OUT</button>
          ) : (
            <React.Fragment>
              <CustomLink text="Log In" linkTo="/login" isNav />
              <CustomLink text="Register" linkTo="/register" isNav />
            </React.Fragment>
          )}
        </div>
      </nav>
      {isLogOutModalOpen && <LogoutModal setModalState={setModalState} />}
    </Header>
  );
};

Navbar.propTypes = {};

export default Navbar;
