import type { Config } from "tailwindcss";
import { nextui } from "@nextui-org/react";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",

    "../node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // screens: {
      //   xs: "540px",
      // },
      colors: {
        primary: "#177981",
        secondary: "#fdbb2d",
        // secondary: "#ff807e",
        font: "#000000",
        light: "#FAFAFA",
        background: "#FFFFFF",
        "success-light": "#EFFCEE",
        danger: "#B33939",
        "danger-light": "#FCEEEE",
      },
      keyframes: {
        "animate-enter": {
          "0%": {
            transform: "translateX(50%)",
          },
          "100%": {
            transform: "translateX(0%)",
          },
        },
      },
      animation: {
        "animate-enter": "animate-enter 150ms ease-out",
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
              "50": "rgba(23, 121, 129, 0.1)",
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
              DEFAULT: "#F8F8F8",
              "100": "#FAFAFA",
              "200": "#F8F8F8",
            },
            success: {
              DEFAULT: "#32a852",
              foreground: "#FFF",
            },
            danger: {
              DEFAULT: "#f53636",
              foreground: "#FFF",
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
