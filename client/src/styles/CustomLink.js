import React from "react";
import { Link } from "@reach/router";

const CustomLink = ({
  disabled,
  text,
  linkTo,
  isNav,
  isNavPrimaryButton,
  isPrimary,
  isSecondary,
  isTertiary,
  ...rest
}) => {
  if (isNav) {
    return (
      <Link className={`text-green-500 hover:text-green-700 ${rest.className}`} to={`${linkTo}`}>
        {text}
      </Link>
    );
  }

  if (isNavPrimaryButton) {
    return (
      <Link className={`text-white ${rest.className}`} to={`${linkTo}`}>
        {text}
      </Link>
    );
  }
  if (isPrimary) {
    return (
      <Link
        className={`bg-green-600 px-4 py-2 text-white text-center mb-4 rounded-md hover:bg-green-500 ${rest.className}`}
        to={`${linkTo}`}
      >
        {text}
      </Link>
    );
  }
  if (isSecondary) {
    if (disabled) {
      return (
        <div className="inline-block w-full bg-coolGray-200  px-4 py-2 text-green-600 text-center mb-4 rounded-md cursor-not-allowed">
          {text}
        </div>
      );
    }
    return (
      <Link
        className="inline-block w-full bg-coolGray-200  px-4 py-2 text-green-600 text-center mb-4 rounded-md"
        to={`${linkTo}`}
        {...rest}
      >
        {text}
      </Link>
    );
  }
  return (
    <Link className="text-blue-600 hover:text-blue-500" to={`${linkTo}`} {...rest}>
      {text}
    </Link>
  );
};

export default CustomLink;
