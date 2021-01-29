const color = require("tailwindcss/colors");

module.exports = {
  purge: ["./public/**/*.html"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        ...color,
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
