import React, { useState } from "react";

import { Header, CustomLink } from "../../styles";
import { useSelector } from "react-redux";
import LogoutModal from "../LogoutModal";

const Navbar = (props) => {
  const [isLogOutModalOpen, setModalState] = useState(false);
  const [isMobileMenuOpen, setMobileMenuState] = useState(false);
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
        <div className="flex justify-between items-center border-b-2 border-gray-100 py-6 md:justify-start md:space-x-10">
          <div className={`flex ${isLoggedIn ? `justify-start` : `justify-center`} lg:w-0 lg:flex-1`}>
            {/* <a href="/">
                <span className="sr-only">Workflow</span>
                
                <img
                  className="h-8 w-auto sm:h-10"
                  src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                  alt=""
                />
              </a> */}
            <CustomLink text="LogoHome" linkTo="/" isNav />
          </div>
          {/* 
            <div className="-mr-2 -my-2 md:hidden">
              <button
                type="button"
                className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                aria-expanded="false"
              >
                <span className="sr-only">Open menu</span>
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
               */}

          {isLoggedIn && (
            <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">
              <button onClick={() => handleLogOutModalClick()}>LOG OUT</button>
            </div>
          )}

          {/* <React.Fragment> */}
          {/* <CustomLink
                  className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900"
                  text="Log In"
                  linkTo="/login"
                  isNav
                /> */}
          {/* <CustomLink
                  className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                  text="Register"
                  linkTo="/register"
                  isNavPrimaryButton
                /> */}
          {/* </React.Fragment> */}

          {/* <a href="/" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
                Sign in
              </a>
              <a
                href="/"
                className="ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign up
              </a> */}
        </div>
      </div>

      {/* <!--
    Mobile menu, show/hide based on mobile menu state.

    Entering: "duration-200 ease-out"
      From: "opacity-0 scale-95"
      To: "opacity-100 scale-100"
    Leaving: "duration-100 ease-in"
      From: "opacity-100 scale-100"
      To: "opacity-0 scale-95"
  --> */}
      {/* <div className="absolute top-0 inset-x-0 p-2 transition transform origin-topRight md:hidden">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center justify-between">
                <div>
                  <img
                    className="h-8 w-auto"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
                    alt="Workflow"
                  /> 
                  <CustomLink text="Home" linkTo="/" isNav />
                </div>
                <div className="-mr-2">
                  <button
                    type="button"
                    className="bg-white rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                  >
                    <span className="sr-only">Close menu</span>
       
                    <svg
                      className="h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-6"> <nav className="grid gap-y-8"></nav> </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              <div className="grid grid-cols-2 gap-y-4 gap-x-8"></div>
              <div>
                <a
                  href="/"
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Sign up
                </a>
                <p className="mt-6 text-center text-base font-medium text-gray-500">
                  Existing customer?
                  <a href="/" className="text-indigo-600 hover:text-indigo-500">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      */}
      {isLogOutModalOpen && <LogoutModal setModalState={setModalState} />}
    </div>
  );
};

export default Navbar;
