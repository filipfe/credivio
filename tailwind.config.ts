import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#177981",
        secondary: "#ffc000",
        // secondary: "#ff807e",
        font: "#000000",
        light: "#FAFAFA",
        background: "#FFFFFF",
        success: "#3CC92F",
        "success-light": "#EFFCEE",
        danger: "#C93C2F",
        "danger-light": "#FCEEEE",
      },
    },
  },
  darkMode: "class",
  plugins: [
    nextui({
      defaultTheme: "light",
      layout: {
        radius: {
          small: "2px",
          medium: "6px",
          large: "12px",
        },
      },
      themes: {
        light: {
          colors: {
            primary: "#177981",
            secondary: "#ffc000",
            content1: "#FFF",
          },
          layout: {
            hoverOpacity: 95,
          },
        },
      },
    }),
  ],
};
export default config;
