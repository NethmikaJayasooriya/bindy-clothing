import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "var(--color-paper)",
          light: "var(--color-paper-light)",
          dark: "var(--color-paper-dark)",
        },
        sand: {
          DEFAULT: "var(--color-sand)",
          light: "var(--color-sand-light)",
        },
        sea: {
          DEFAULT: "var(--color-sea-blue)",
          gem: "var(--color-gem-blue)",
          pastel: "var(--color-pastel-blue)",
        },
        sage: "var(--color-sage)",
        cinnamon: "var(--color-cinnamon)",
        terracotta: "var(--color-terracotta)",
        lotus: "var(--color-lotus-pink)",
        charcoal: "var(--color-charcoal)",
        ink: {
          DEFAULT: "var(--color-ink, #181614)",
          deep: "var(--color-ink-deep, #121110)",
        },
        gold: "var(--color-gold)",
        muted: "var(--color-muted)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
