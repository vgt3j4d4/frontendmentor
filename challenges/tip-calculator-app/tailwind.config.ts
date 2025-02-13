import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      backgroundImage: {
        "image-dollar": "url('/images/icon-dollar.svg')",
        "image-person": "url('/images/icon-person.svg')"
      },
      backgroundPosition: {
        "left_20-center": "left 20px center",
      },
    },
  },
  plugins: [],
};
export default config;
