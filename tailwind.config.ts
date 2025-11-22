import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./content/**/*.{md,mdx}",
    "./public/**/*.html"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          900: "#020617",
          800: "#020617",
          700: "#020617"
        }
      },
      fontFamily: {
        sans: ["system-ui", "SF Pro Text", "Inter", "ui-sans-serif", "sans-serif"],
        display: ["system-ui", "SF Pro Display", "Inter", "ui-sans-serif", "sans-serif"],
        mono: ["ui-monospace", "SF Mono", "Menlo", "Monaco", "Consolas", "monospace"]
      },
      boxShadow: {
        "glow-sm": "0 0 30px rgba(59,130,246,0.25)",
        "glow-lg": "0 0 60px rgba(59,130,246,0.35)"
      },
      backgroundImage: {
        "radial-soft":
          "radial-gradient(circle at top, rgba(56,189,248,0.22), transparent 60%)",
        "radial-amber":
          "radial-gradient(circle at 10% 0%, rgba(251,191,36,0.18), transparent 55%)"
      }
    }
  },
  plugins: [typography]
};

export default config;
