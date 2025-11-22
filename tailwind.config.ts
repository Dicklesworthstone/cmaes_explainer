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
        slate: {
          850: "#10172a", 
          900: "#0f172a", 
          950: "#020617", 
        },
        accent: {
          500: "#38bdf8", // Sky 400
          600: "#0ea5e9", // Sky 500
          glow: "rgba(56, 189, 248, 0.5)",
        }
      },
      fontFamily: {
        sans: [
          "Inter", 
          "-apple-system", 
          "BlinkMacSystemFont", 
          "Segoe UI", 
          "Roboto", 
          "Helvetica Neue", 
          "Arial", 
          "sans-serif"
        ],
        display: [
          "Manrope", 
          "Inter", 
          "system-ui", 
          "sans-serif"
        ],
        mono: [
          "JetBrains Mono", 
          "Fira Code", 
          "ui-monospace", 
          "SF Mono", 
          "Menlo", 
          "monospace"
        ]
      },
      boxShadow: {
        "glass": "0 4px 30px rgba(0, 0, 0, 0.1)",
        "glass-hover": "0 10px 40px rgba(0, 0, 0, 0.2)",
        "glow-sm": "0 0 20px rgba(56,189,248,0.15)",
        "glow-lg": "0 0 50px rgba(56,189,248,0.25)",
        "inner-light": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
        "surface": "0 1px 2px -1px rgba(0,0,0,0.1), 0 1px 3px 0 rgba(0,0,0,0.1)"
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
        "radial-soft": "radial-gradient(circle at top, rgba(56,189,248,0.12), transparent 40%)",
        "gradient-surface": "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.0))",
      },
      animation: {
        "shimmer": "shimmer 2.5s linear infinite",
        "fade-in-up": "fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: [typography]
};

export default config;
