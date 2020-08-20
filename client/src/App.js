import React, { useState, useEffect } from "react";
import { Router, Link, Redirect } from "@reach/router";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import usePersistedState from "./components/usePersistedState";

const App = () => {
  const [isLoggedIn, setLoggedIn] = usePersistedState(`isLoggedIn`, false);
  const [firstName, setFirstName] = usePersistedState(`firstName`, "");
  const [lastName, setLastName] = usePersistedState(`lastName`, "");
  const [email, setEmail] = usePersistedState(`email`, "");
  const [userId, setUserId] = usePersistedState(`userId`, 0);
  const [todolists, setTodolists] = usePersistedState(`todolists`, []);
  const [persistedData, setPersistedData] = usePersistedState(
    `persistedData`,
    {}
  );
  const [stateData, setStateData] = useState(persistedData);

  const [jwt, setJwt] = usePersistedState(`Authorization`, "");
  const [fetching, setFetching] = useState(false);
  const [reordering, setReordering] = useState(false);

  // Fetch data on page refresh
  const pageRefresh = () => {
    if (window.performance) {
      if (performance.navigation.type) {
        setFetching(true);
      } else {
        setFetching(false);
      }
    }
  };

  useEffect(() => {
    pageRefresh();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <nav>
          <Link to="/">Home</Link>
          {isLoggedIn ? (
            <Link to="/logout">Log Out</Link>
          ) : (
            <Link to="/login">Log In</Link>
          )}
        </nav>
      </header>
      <Router>
        <Home
          path="/"
          firstName={firstName}
          userId={userId}
          isLoggedIn={isLoggedIn}
          jwt={jwt}
          todolists={todolists}
          setTodolists={setTodolists}
          fetching={fetching}
          setFetching={setFetching}
          reordering={reordering}
          setReordering={setReordering}
          stateData={stateData}
          setStateData={setStateData}
          setPersistedData={setPersistedData}
        />
        <Login
          isLoggedIn={isLoggedIn}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
          setUserId={setUserId}
          setLoggedIn={setLoggedIn}
          setFetching={setFetching}
          setJwt={setJwt}
          path="/login"
        />
        <Redirect from="/login" to="/" />
        <Logout
          userFirstName={firstName}
          userLastName={lastName}
          userEmail={email}
          jwt={jwt}
          isLoggedIn={isLoggedIn}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
          setLoggedIn={setLoggedIn}
          setJwt={setJwt}
          setUserId={setUserId}
          setTodolists={setTodolists}
          setPersistedData={setPersistedData}
          path="/logout"
        />
        <Register
          path="register"
          isLoggedIn={isLoggedIn}
          firstName={firstName}
          lastName={lastName}
          email={email}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
        />
      </Router>
    </div>
  );
};

export default App;
