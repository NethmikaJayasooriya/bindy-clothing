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
          DEFAULT: "var(--color-paper, #FAF7F2)",
          light: "var(--color-paper-light, #FFFDF9)",
          dark: "var(--color-paper-dark, #F2ECE1)",
          linen: "#FBF9F5",
          champagne: "#F4EFE6",
        },
        sand: {
          DEFAULT: "var(--color-sand, #DCC7AF)",
          light: "var(--color-sand-light, #EFE7DC)",
          warm: "#D4C0A8",
          border: "rgba(220, 199, 175, 0.45)",
          hairline: "rgba(220, 199, 175, 0.25)",
        },
        sea: {
          DEFAULT: "var(--color-sea-blue, #2F4F6F)",
          gem: "var(--color-gem-blue, #6FA4B8)",
          pastel: "var(--color-pastel-blue, #C8D8E6)",
        },
        sage: "var(--color-sage, #AFC8B1)",
        cinnamon: "var(--color-cinnamon, #A46446)",
        terracotta: "var(--color-terracotta, #B86B4B)",
        lotus: "var(--color-lotus-pink, #E8B7C3)",
        charcoal: {
          DEFAULT: "var(--color-charcoal, #1F1E1D)",
          rich: "#141312",
          soft: "#363330",
          subtle: "#5A544F",
        },
        ink: {
          DEFAULT: "var(--color-ink, #181614)",
          deep: "var(--color-ink-deep, #121110)",
        },
        gold: {
          DEFAULT: "var(--color-gold, #C5A059)",
          light: "#DFC182",
          dark: "#A6823B",
          shimmer: "#F3E5C8",
          glow: "rgba(197, 160, 89, 0.25)",
        },
        muted: "var(--color-muted, #78716A)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Fraunces", "Georgia", "serif"],
        display: ["var(--font-display)", "Fraunces", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        'widest-caps': '0.32em',
        'wide-caps': '0.28em',
        'tight-display': '-0.025em',
        'tight-hero': '-0.035em',
      },
      boxShadow: {
        'luxury': '0 8px 30px -6px rgba(31, 30, 29, 0.06), 0 2px 8px -2px rgba(31, 30, 29, 0.04)',
        'luxury-hover': '0 20px 40px -10px rgba(31, 30, 29, 0.1), 0 4px 16px -4px rgba(197, 160, 89, 0.15)',
        'paper-card': '0 4px 20px -4px rgba(90, 75, 60, 0.05), 0 1px 3px rgba(90, 75, 60, 0.02)',
        'gold-glow': '0 0 30px -4px rgba(197, 160, 89, 0.28)',
        'gold-glow-lg': '0 0 45px 0 rgba(197, 160, 89, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
