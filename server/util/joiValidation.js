import Joi from "@hapi/joi";
import passwordComplexity from "joi-password-complexity";

const complexityOptions = {
  min: 6,
  max: 40,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
};

const validateRegistration = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: passwordComplexity(complexityOptions),
  });

  return schema.validate(data);
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });

  return schema.validate(data);
};

const validateTodolistTitle = (data) => {
  const schema = Joi.object({
    title: Joi.string().required(),
  });

  return schema.validate(data);
};

const validateTodoDescription = (data) => {
  const schema = Joi.object({
    description: Joi.string().required(),
  });

  return schema.validate(data);
};

export {
  validateRegistration,
  validateLogin,
  validateTodolistTitle,
  validateTodoDescription,
};
