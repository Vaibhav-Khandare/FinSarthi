import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: "#eef2ff",
          100: "#e0e7ff",
          500: "#4338ca",
          600: "#3730a3",
          700: "#312e81",
          800: "#1e1b4b",
          900: "#0f0d2e",
        },
        emerald: {
          500: "#10b981",
          600: "#059669",
        },
        amber: {
          500: "#f59e0b",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
