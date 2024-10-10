import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#177981",
        // primary: "#0064FF",
        "primary-dark": "#115b61",
        // "primary-dark": "#272C7D",
        font: "#000",
        secondary: "#fdbb2d",
        foreground: "#041617",
        light: "#FAFAFA",
      },
      fontSize: {
        xs: "12px",
      },
    },
  },
  plugins: [],
};
export default config;
