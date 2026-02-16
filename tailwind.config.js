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
        lavaOne: {
          "0%": {
            transform: "translate3d(0, 0, 0) scale(1)",
            borderRadius: "46% 54% 62% 38% / 46% 41% 59% 54%",
          },
          "50%": {
            transform: "translate3d(28px, -36px, 0) scale(1.12)",
            borderRadius: "58% 42% 39% 61% / 54% 63% 37% 46%",
          },
          "100%": {
            transform: "translate3d(-18px, 22px, 0) scale(0.96)",
            borderRadius: "43% 57% 60% 40% / 45% 38% 62% 55%",
          },
        },
        lavaTwo: {
          "0%": {
            transform: "translate3d(0, 0, 0) scale(1)",
            borderRadius: "52% 48% 40% 60% / 55% 42% 58% 45%",
          },
          "50%": {
            transform: "translate3d(-36px, 30px, 0) scale(1.1)",
            borderRadius: "39% 61% 57% 43% / 47% 61% 39% 53%",
          },
          "100%": {
            transform: "translate3d(24px, -22px, 0) scale(0.94)",
            borderRadius: "60% 40% 49% 51% / 43% 55% 45% 57%",
          },
        },
        lavaThree: {
          "0%": {
            transform: "translate3d(0, 0, 0) scale(1)",
            borderRadius: "44% 56% 50% 50% / 60% 43% 57% 40%",
          },
          "50%": {
            transform: "translate3d(22px, 34px, 0) scale(1.14)",
            borderRadius: "57% 43% 62% 38% / 41% 54% 46% 59%",
          },
          "100%": {
            transform: "translate3d(-26px, -28px, 0) scale(0.92)",
            borderRadius: "48% 52% 36% 64% / 56% 47% 53% 44%",
          },
        },
        floatDrift: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -10px, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
        floatDriftAlt: {
          "0%": { transform: "translate3d(0, 0, 0)" },
          "50%": { transform: "translate3d(0, -7px, 0)" },
          "100%": { transform: "translate3d(0, 0, 0)" },
        },
      },
      animation: {
        "hanger-intro": "hangerIntro 1s ease-out 0.15s 1",
        "hanger-swing": "hangerSwing 0.75s ease-in-out 1",
        "lava-one": "lavaOne 18s ease-in-out infinite alternate",
        "lava-two": "lavaTwo 22s ease-in-out infinite alternate",
        "lava-three": "lavaThree 20s ease-in-out infinite alternate",
        "float-drift": "floatDrift 5.5s ease-in-out infinite",
        "float-drift-alt": "floatDriftAlt 6.5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
