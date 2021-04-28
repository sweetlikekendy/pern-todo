import React, { useState } from "react";
import { CustomLink } from "../../styles";
import { useSelector } from "react-redux";
import LogoutModal from "../LogoutModal";

const Navbar = (props) => {
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
    <div className={`relative bg-white ${props.className ? props.className : ``}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex ${isLoggedIn && `justify-between`} border-b-2 border-gray-100 py-6 `}>
          <div className={`${isLoggedIn ? `justify-start` : `w-full text-center`}`}>
            <CustomLink text="LogoHome" linkTo="/" isNav />
          </div>

          {isLoggedIn && (
            <div className="md:flex items-center justify-end md:flex-1">
              <button onClick={() => handleLogOutModalClick()}>LOG OUT</button>
            </div>
          )}
        </div>
      </div>
      {isLogOutModalOpen && <LogoutModal setModalState={setModalState} />}
    </div>
  );
};

export default Navbar;
