import React, { useState, useEffect } from "react";
import { Router } from "@reach/router";
import Home from "./components/Home";
import Login from "./components/Login";
import { Navbar } from "./components/Navbar";
import Register from "./components/Register";
import Logout from "./components/Logout";
import usePersistedState from "./components/usePersistedState";
import { AppContainer } from "./styles";

import "tailwindcss/dist/base.min.css";
import "./tailwind.output.css";

const App = () => {
  // const [isLoggedIn, setLoggedIn] = useState(`isLoggedIn`, false);
  // const [firstName, setFirstName] = useState(`firstName`, "");
  // const [lastName, setLastName] = useState(`lastName`, "");
  // const [email, setEmail] = useState(`email`, "");
  // const [userId, setUserId] = useState(`userId`, 0);
  // const [persistedData, setPersistedData] = useState(`persistedData`, {});
  // const [isLoggedIn, setLoggedIn] = usePersistedState(`isLoggedIn`, false);
  // const [firstName, setFirstName] = usePersistedState(`firstName`, "");
  // const [lastName, setLastName] = usePersistedState(`lastName`, "");
  // const [email, setEmail] = usePersistedState(`email`, "");
  // const [userId, setUserId] = usePersistedState(`userId`, 0);
  // const [persistedData, setPersistedData] = usePersistedState(`persistedData`, {});
  // const [stateData, setStateData] = useState(persistedData);
  // const [stateUserId, setStateUserId] = useState(userId);

  // const [jwt, setJwt] = usePersistedState(`Authorization`, "");
  // const [fetching, setFetching] = useState(false);
  // const [reordering, setReordering] = useState(false);

  // Fetch data on page refresh
  // const pageRefresh = () => {
  //   if (window.performance) {
  //     if (performance.navigation.type) {
  //       setFetching(true);
  //     } else {
  //       setFetching(false);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   pageRefresh();
  // }, []);

  return (
    <AppContainer className="App">
      <Navbar />
      {/* <Navbar isLoggedIn={isLoggedIn} /> */}
      <Router>
        <Home
          path="/"
          // firstName={firstName}
          // userId={userId}
          // isLoggedIn={isLoggedIn}
          // jwt={jwt}
          // fetching={fetching}
          // setFetching={setFetching}
          // stateData={stateData}
          // setStateData={setStateData}
          // setPersistedData={setPersistedData}
        />
        <Login
          // isLoggedIn={isLoggedIn}
          // setFirstName={setFirstName}
          // setLastName={setLastName}
          // setEmail={setEmail}
          // setUserId={setUserId}
          // setLoggedIn={setLoggedIn}
          // setFetching={setFetching}
          // setJwt={setJwt}
          path="/login"
        />
        <Logout
          // userFirstName={firstName}
          // userLastName={lastName}
          // userEmail={email}
          // jwt={jwt}
          // isLoggedIn={isLoggedIn}
          // setFirstName={setFirstName}
          // setLastName={setLastName}
          // setEmail={setEmail}
          // setLoggedIn={setLoggedIn}
          // setJwt={setJwt}
          // setUserId={setUserId}
          // setPersistedData={setPersistedData}
          path="/logout"
        />
        <Register
          path="register"
          // isLoggedIn={isLoggedIn}
        />
      </Router>
    </AppContainer>
  );
};

export default App;
