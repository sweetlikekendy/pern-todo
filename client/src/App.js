import React from "react";
import { Router } from "@reach/router";
import Home from "./components/Home";
import Login from "./components/Login";
import { Navbar } from "./components/Navbar";
import Footer from "./components/Footer";
import Register from "./components/Register";
import Logout from "./components/Logout";
import RegisterSuccess from "./components/RegisterSuccess";

import "tailwindcss/dist/base.min.css";
import "./tailwind.output.css";

const App = () => {
  return (
    <div className="flex flex-col h-screen justify-between text-coolGray-500">
      <Navbar />
      <div>
        <Router>
          <Home path="/" />
          <Login path="/login" />
          <Logout path="/logout" />
          <Register path="/register" />
          <RegisterSuccess path="/register-success" />
        </Router>
      </div>
      <Footer />
    </div>
  );
};

export default App;
