import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        poppins: ["var(--font-Poppins)"],
        josefin: ["var(--font-Josefin)"],
      },
      colors: {
        primary: {
          DEFAULT: "#6366f1", // Indigo
        },
        secondary: {
          DEFAULT: "#ec4899", // Pink
        },
        accent: {
          DEFAULT: "#f59e42", // Amber
        },
        background: {
          light: "#f8fafc",
          dark: "#18181b",
        },
        surface: {
          light: "#fff",
          dark: "#23272f",
        },
        text: {
          DEFAULT: "#1e293b", // Slate
          light: "#f1f5f9",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      screens: {
        "400px": "400px",
        "800px": "800px",
        "1000px": "1000px",
        "1100px": "1100px",
        "1200px": "1200px",
        "1300px": "1300px",
        "1500px": "1500px",
      },
    },
  },
  plugins: [],
};

export default config;
