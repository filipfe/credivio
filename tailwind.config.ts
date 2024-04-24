import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",

    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#177981",
        secondary: "#fdbb2d",
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
            primary: {
              DEFAULT: "#177981",
              foreground: "#FFF",
            },
            secondary: "#fdbb2d",
            content1: "#FFF",
            content3: {
              DEFAULT: "#F0F0F0",
            },
            content4: {
              DEFAULT: "#e0e0e0",
            },
            default: {
              "100": "#FAFAFA",
            },
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
