import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#F8FAFC",
        surface: "#FFFFFF",
        "surface-muted": "#F1F5F9",
        border: "#E2E8F0",
        ink: "#0F172A",
        "ink-muted": "#64748B",
        primary: "#4F46E5",
        "primary-dark": "#3730A3",
        "primary-soft": "#EEF2FF",
        accent: "#F59E0B",
        success: "#15803D",
        warning: "#B7791F",
        danger: "#B91C1C",
      },
      boxShadow: {
        soft: "0 16px 48px rgba(15, 23, 42, 0.08)",
      },
    },
  },
  plugins: [],
};

export default config;
