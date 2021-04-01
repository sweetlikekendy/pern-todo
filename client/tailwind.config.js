/* eslint-disable no-undef */
const colors = require("tailwindcss/colors");

module.exports = {
  purge: [],
  theme: {
    colors: {
      ...colors,
    },
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    fontFamily: {
      display: ["Gilroy", "sans-serif"],
      body: ["Graphik", "sans-serif"],
    },
    borderWidth: {
      default: "1px",
      0: "0",
      2: "2px",
      4: "4px",
    },
    extend: {
      spacing: {
        72: "18rem",
        84: "21rem",
        96: "24rem",
        128: "32rem",
      },
    },
  },
  variants: { width: ["responsive", "hover", "focus"] },
  plugins: [require("@tailwindcss/forms")],
};
