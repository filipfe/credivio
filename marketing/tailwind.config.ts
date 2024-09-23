import type { Config } from "tailwindcss";
import { createPreset } from "fumadocs-ui/tailwind-plugin";

const config: Config = {
  content: [
    "./components/**/*.{ts,tsx,md,mdx}",
    "./app/**/*.{ts,tsx,md,mdx}",
    "./content/**/*.{ts,tsx,md,mdx}",
    "./mdx-components.{ts,tsx,md,mdx}",
    "../node_modules/fumadocs-ui/dist/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#177981",
        // primary: "#0064FF",
        "primary-dark": "#115b61",
        // "primary-dark": "#272C7D",
        secondary: "#fdbb2d",
        foreground: "#041617",
        light: "#FAFAFA",
      },
      fontSize: {
        xs: "12px",
      },
    },
  },
  darkMode: "class",
  presets: [createPreset()],
};
export default config;
