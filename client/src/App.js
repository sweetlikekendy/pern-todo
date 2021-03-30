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
  return (
    <AppContainer className="App">
      <Navbar />

      <Router>
        <Home path="/" />
        <Login path="/login" />
        <Logout path="/logout" />
        <Register path="register" />
      </Router>
    </AppContainer>
  );
};

export default App;
