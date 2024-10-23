/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./**/*.{css,scss,js,ts}",
    "!./node_modules/**/*.{css,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        rubik: ["Rubik Regular", "sans-serif", "system-ui"],
        "rubik-light": ["Rubik Light", "sans-serif", "system-ui"],
        "rubik-medium": ["Rubik Medium", "sans-serif", "system-ui"],
      },
      backgroundPosition: {
        "right_20-top_-10": "right 20px top -10px",
        "right_20-top_-2": "right 20px top -2px",
      },
    },
  },
  plugins: [],
};
