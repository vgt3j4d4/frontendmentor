/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts,css}"],
  theme: {
    extend: {
      screens: {
        mobile: "23.4375rem" /* 375px */,
        tablet: "48rem" /* 768px */,
        desktop: "64rem" /* 1024px */,
      },
      fontSize: {
        "heading-l": "2rem",
        "heading-m": "1.5rem",
        "body-m": "1.125rem",
      },
      colors: {
        red: "var(--red)",
        orange: "var(--orange)",
        yellow: "var(--yellow)",
        "neon-green": "var(--neon-green)",
        "almost-white": "var(--almost-white)",
        grey: "var(--grey)",
        "dark-grey": "var(--dark-grey)",
        "very-dark-grey": "var(--very-dark-grey)",
      },
    },
  },
  plugins: [],
};
