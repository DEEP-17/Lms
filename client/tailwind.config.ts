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
        primary: "#1dbf73", // Soft green
        secondary: "#0e2e2b", // Deep teal
        accent: "#e6f4f1", // Light mint
        muted: "#f8fafc", // Light background
        card: "#fff", // Card background
        heading: "#1a2e35", // Heading text
        subtext: "#6b7280", // Subtext

        // move your custom colors into a nested object to avoid conflict:
        customColors: {
          backgroundLight: "#f8fafc",
          backgroundDark: "#18181b",
          surfaceLight: "#fff",
          surfaceDark: "#23272f",
          textDefault: "#1e293b",
          textLight: "#f1f5f9",
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
