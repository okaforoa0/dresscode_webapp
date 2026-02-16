/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        earth: {
          bg: "#f3efe8",
          card: "#fffdf9",
          text: "#3f3a34",
          sand: "#cbbba5",
          moss: "#6f7f68",
          sage: "#9aaa8a",
          stone: "#8e8a84",
          pine: "#4f5f4a",
          clay: "#b77b63",
        },
      },
    },
  },
  plugins: [],
};
