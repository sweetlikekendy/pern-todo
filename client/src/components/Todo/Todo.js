import React from "react";
import PropTypes from "prop-types";

const Todo = ({ description }) => {
  return <li>{description}</li>;
};

Todo.propTypes = {};

export default Todo;
