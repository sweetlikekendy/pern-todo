import React from "react";
import { Redirect } from "@reach/router";
import { useDispatch, useSelector } from "react-redux";

const Logout = () => {
  const dispatch = useDispatch();
  // TODO confirm the logout with a modal
  // Get JWT for http requests
  const loggedInUserData = useSelector((state) => {
    // if there's a user, that means user has logged in
    if (state.users.ids.length > 0) {
      const { users } = state;
      const { ids: userIds, entities: userEntities } = users;
      const { loggedIn } = userEntities[userIds[0]];

      return { loggedIn };
    }
    return { loggedIn: false };
  });

  const { loggedIn: isLoggedIn } = loggedInUserData;
  return <div>{isLoggedIn ? <p>You&apos;re already logged in!</p> : <Redirect to="/" noThrow />}</div>;
};

Logout.propTypes = {};

export default Logout;
