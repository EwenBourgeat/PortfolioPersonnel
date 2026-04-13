import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: "#0D1117",
        deep: "#111827",
        surface: "#1A2332",
        card: "#243044",
        "card-border": "#2A3F5F",
        forest: "#4A7C59",
        sage: "#8BAF7C",
        ink: "#F0EDE8",
        muted: "#8A9BAE",
        faint: "#4A5568",
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "ui-serif", "Georgia", "serif"],
        sans: ["var(--font-geist-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.03em",
      },
    },
  },
  plugins: [],
};

export default config;
