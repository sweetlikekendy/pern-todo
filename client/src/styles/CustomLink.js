import React from "react";
import { Link } from "@reach/router";

const CustomLink = ({
  text,
  linkTo,
  isNav,
  isPrimary,
  isSecondary,
  isTertiary,
}) => {
  if (isNav) {
    return (
      <Link className="text-teal-500 hover:text-teal-800" to={`${linkTo}`}>
        {text}
      </Link>
    );
  }
  if (isPrimary) {
    return (
      <Link
        className="bg-green-600 px-4 py-2 text-white text-center mb-4 rounded-md w-full hover:bg-green-500"
        to={`${linkTo}`}
      >
        {text}
      </Link>
    );
  }
  if (isSecondary) {
    return (
      <Link
        className="border border-green-600 px-4 py-2 text-green-600 text-center mb-4 rounded-md w-full hover:bg-green-600 hover:text-white"
        to={`${linkTo}`}
      >
        {text}
      </Link>
    );
  }
  return (
    <Link className="text-blue-600 hover:text-blue-500" to={`${linkTo}`}>
      {text}
    </Link>
  );
};

export default CustomLink;
