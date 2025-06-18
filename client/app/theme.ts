import { Theme } from "theme-ui";

export const theme: Theme = {
  initialColorModeName: "light",
  useColorSchemeMediaQuery: true,
  colors: {
    text: "#1e293b",
    background: "#f8fafc",
    primary: "#6366f1",
    secondary: "#ec4899",
    accent: "#f59e42",
    modes: {
      dark: {
        text: "#f1f5f9",
        background: "#18181b",
        primary: "#818cf8",
        secondary: "#f472b6",
        accent: "#fbbf24",
      },
      vibrant: {
        text: "#fff",
        background: "#7c3aed",
        primary: "#f59e42",
        secondary: "#ec4899",
        accent: "#22d3ee",
      },
      pastel: {
        text: "#374151",
        background: "#f1f5f9",
        primary: "#a5b4fc",
        secondary: "#fbcfe8",
        accent: "#fcd34d",
      },
    },
  },
  fonts: {
    body: "system-ui, sans-serif",
    heading: '"Avenir Next", sans-serif',
    monospace: "Menlo, monospace",
  },
};
