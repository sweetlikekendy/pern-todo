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
  const [numOfTodolists, setNumOfTodolists] = usePersistedState(
    `numOfTodolists`,
    0
  );
  const [jwt, setJwt] = usePersistedState(`Authorization`, "");
  const [fetching, setFetching] = useState(false);
  const [reordering, setReordering] = useState(false);
  const [moveUp, setMoveUp] = useState(false);
  const [moveDown, setMoveDown] = useState(false);

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

  // Move and item up on a todolist or todo
  const moveItemUp = async (index) => {
    const currentIndex = index;
    let newIndex = 0;

    console.log("up");
    console.log("current index", currentIndex);
    if (currentIndex === 0) {
      return console.log("can't move up, already at the top");
    }
    if (currentIndex !== 0) {
      newIndex = index - 1;
      console.log("new index", newIndex);

      const todolistCurrent = todolists[currentIndex];
      const todolistAhead = todolists[newIndex];

      console.log("current todolist", todolistCurrent);
      console.log("todolist ahead", todolistAhead);
      todolists[currentIndex] = todolistAhead;
      todolists[newIndex] = todolistCurrent;

      await setTodolists(todolists);

      console.log("new persisted todolist order", todolists);
      setReordering(true);
    }
  };

  // Move and item down on a todolist or todo
  const moveItemDown = async (index) => {
    const currentIndex = index;
    let newIndex = 0;

    console.log("down");
    console.log("current index", currentIndex);
    if (currentIndex === todolists.length - 1) {
      return console.log("can't move down, already at the bottom");
    }
    if (currentIndex !== todolists.length - 1) {
      newIndex = index + 1;
      console.log("new index", newIndex);

      const todolistCurrent = todolists[currentIndex];
      const todolistBehind = todolists[newIndex];

      console.log("current todolist", todolistCurrent);
      console.log("todolist behind", todolistBehind);
      todolists[currentIndex] = todolistBehind;
      todolists[newIndex] = todolistCurrent;

      await setTodolists(todolists);
      console.log("new persisted todolist order", todolists);
      setReordering(true);
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
          numOfTodolists={numOfTodolists}
          todolists={todolists}
          setTodolists={setTodolists}
          setNumOfTodolists={setNumOfTodolists}
          fetching={fetching}
          setFetching={setFetching}
          moveItemUp={moveItemUp}
          moveItemDown={moveItemDown}
          reordering={reordering}
          setReordering={setReordering}
          moveUp={moveUp}
          setMoveUp={setMoveUp}
          moveDown={moveDown}
          setMoveDown={setMoveDown}
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
          setNumOfTodolists={setNumOfTodolists}
          setTodolists={setTodolists}
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
