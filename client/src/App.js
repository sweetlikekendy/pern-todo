import React, { useState } from "react";
import { Router, Link, Redirect } from "@reach/router";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Logout from "./components/Logout";
import usePersistedState from "./components/usePersistedState";

const App = () => {
  // const [isLoggedIn, setLoggedIn] = useState(false);
  // const [firstName, setFirstName] = useState("");
  // const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  const [isLoggedIn, setLoggedIn] = usePersistedState(`isLoggedIn`, false);
  const [firstName, setFirstName] = usePersistedState(`firstName`, "");
  const [lastName, setLastName] = usePersistedState(`lastName`, "");
  const [email, setEmail] = usePersistedState(`email`, "");
  const [todolists, setTodolists] = usePersistedState(`todolists`, "");
  const [todos, setTodos] = usePersistedState(`todos`, "");
  const [numOfTodolists, setNumOfTodolists] = usePersistedState(
    `numOfTodolists`,
    todolists.length
  );
  const [numOfTodos, setNumOfTodos] = usePersistedState(
    `numOfTodos`,
    todos.length
  );
  const [jwt, setJwt] = usePersistedState(`Authorization`, "");

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
          isLoggedIn={isLoggedIn}
          jwt={jwt}
          numOfTodolists={numOfTodolists}
          numOfTodos={numOfTodos}
          todolists={todolists}
          todos={todos}
          setTodolists={setTodolists}
          setTodos={setTodos}
          setNumOfTodolists={setNumOfTodolists}
          setNumOfTodos={setNumOfTodos}
        />
        <Login
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
          setNumOfTodolists={setNumOfTodolists}
          setNumOfTodos={setNumOfTodos}
          setTodolists={setTodolists}
          setTodos={setTodos}
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
