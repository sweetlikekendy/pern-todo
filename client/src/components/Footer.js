import React from "react";

export default function Footer(props) {
  const date = new Date();
  const year = date.getFullYear();
  return (
    <footer className={`bg-white ${props.className ? props.className : ``}`}>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:text-center lg:px-8">
        <div className="mt-8 md:mt-0">
          <p className="text-center text-base text-gray-400">&copy; {year} Kendy Nguyen. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
