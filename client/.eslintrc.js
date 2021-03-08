module.exports = {
  env: {
    es6: true,
  },
  extends: [ 
    "eslint:recommended",
  "plugin:import/errors",
  "plugin:import/warnings",
  "plugin:react/recommended",
  "plugin:jsx-a11y/recommended",

],
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react", "react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn", // Checks effect dependencies
    "react/prop-types": "warn", // Checks if props have a defined prop type
    "no-unused-vars": "warn" // Checks if there are unused variables
  },
};
