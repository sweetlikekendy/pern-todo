import React from "react"

const Label = ({ htmlFor, children }) => (
  <label className="text-sm font-medium text-gray-700" htmlFor={htmlFor}>
    {children}
  </label>
)

export default Label;
