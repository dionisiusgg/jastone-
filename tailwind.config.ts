import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        forest: { DEFAULT: "#14382B", dark: "#0C241B", light: "#1F5240" },
        cream: { DEFAULT: "#F6F0E4", dark: "#EAE0CC" },
        gold: { DEFAULT: "#B8924A", light: "#D4B574" },
        ink: "#1A1A17",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: { fadeUp: "fadeUp 0.7s ease-out both" },
    },
  },
  plugins: [],
};

export default config;
