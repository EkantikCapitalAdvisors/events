import type { Config } from "tailwindcss";

/**
 * Brand spec (§9 of the master build spec).
 * Navy + Gold signature pairing on Ivory/White. Slate for supporting text.
 * Signal Red reserved EXCLUSIVELY for "closing soon" urgency.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#1B2A4A",
          900: "#141F38",
          700: "#1B2A4A",
          500: "#2C4068",
        },
        gold: {
          DEFAULT: "#C8A951",
          600: "#B6963F",
        },
        ivory: "#FAF8F5",
        slate: {
          DEFAULT: "#64748B",
          fg: "#64748B",
        },
        signal: "#DC2626",
      },
      fontFamily: {
        display: ["var(--font-cormorant)", "Cormorant Garamond", "serif"],
        body: ["var(--font-dm-sans)", "DM Sans", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      lineHeight: {
        relaxed: "1.7",
      },
      letterSpacing: {
        label: "0.12em",
      },
    },
  },
  plugins: [],
};

export default config;
