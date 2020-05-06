import React, { useState } from "react";
import { Router, Link } from "@reach/router";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

const App = () => {
  const [isLoggedIn, setLogin] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
        <Home path="/" />
        <Login isLoggedIn={isLoggedIn} path="/login" />
        <Register
          path="register"
          firstName={firstName}
          lastName={lastName}
          email={email}
          password={password}
          setFirstName={setFirstName}
          setLastName={setLastName}
          setEmail={setEmail}
          setPassword={setPassword}
        />
      </Router>
    </div>
  );
};

export default App;
