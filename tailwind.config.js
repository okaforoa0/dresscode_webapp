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
      keyframes: {
        hangerIntro: {
          "0%": { transform: "rotate(0deg)" },
          "15%": { transform: "rotate(11deg)" },
          "30%": { transform: "rotate(-9deg)" },
          "45%": { transform: "rotate(7deg)" },
          "60%": { transform: "rotate(-5deg)" },
          "75%": { transform: "rotate(3deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        hangerSwing: {
          "0%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(8deg)" },
          "50%": { transform: "rotate(-8deg)" },
          "75%": { transform: "rotate(5deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
      },
      animation: {
        "hanger-intro": "hangerIntro 1s ease-out 0.15s 1",
        "hanger-swing": "hangerSwing 0.75s ease-in-out 1",
      },
    },
  },
  plugins: [],
};
