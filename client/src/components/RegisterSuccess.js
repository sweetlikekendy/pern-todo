import React from "react";
import { Link } from "@reach/router";

export default function RegisterSuccess() {
  return (
    <div className="p-4 lg:px-12 lg:py-8">
      <h2 className="text-xl font-bold md:text-3xl md:text-center">
        You have registered an account successfully. Please click{" "}
        <Link className="text-green-700" to="/login">
          here
        </Link>{" "}
        to login.{" "}
      </h2>
    </div>
  );
}
