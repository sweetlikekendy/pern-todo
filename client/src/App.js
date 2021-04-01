import React from "react";
import { Router } from "@reach/router";
import Home from "./components/Home";
import Login from "./components/Login";
import { Navbar } from "./components/Navbar";
import Register from "./components/Register";
import Logout from "./components/Logout";
import { AppContainer } from "./styles";

import "tailwindcss/dist/base.min.css";
import "./tailwind.output.css";
import Footer from "./components/Footer";

const App = () => {
  return (
    <div className="flex flex-col h-screen justify-between text-coolGray-500">
      {/* <AppContainer className="App"> */}
      <Navbar />
      <div>
        <Router>
          <Home path="/" />
          <Login path="/login" />
          <Logout path="/logout" />
          <Register path="register" />
        </Router>
      </div>
      <Footer />
      {/* </AppContainer> */}
    </div>
  );
};

export default App;
