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
          850: "#151e32", // Custom deep slate
          950: "#020617", // Deepest
        },
        accent: {
          500: "#38bdf8", // Sky 400
          600: "#0ea5e9", // Sky 500
          glow: "rgba(56, 189, 248, 0.5)",
        }
      },
      fontFamily: {
        // Stripe-like clean sans
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
        // High-tech display
        display: [
          "Manrope", 
          "Inter", 
          "system-ui", 
          "sans-serif"
        ],
        // Crisp code
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
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.3)",
        "glow-sm": "0 0 20px rgba(56,189,248,0.15)",
        "glow-lg": "0 0 50px rgba(56,189,248,0.25)",
        "inner-light": "inset 0 1px 0 0 rgba(255, 255, 255, 0.05)",
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E\")",
        "radial-soft": "radial-gradient(circle at top, rgba(56,189,248,0.15), transparent 50%)",
        "gradient-surface": "linear-gradient(to bottom, rgba(255,255,255,0.03), rgba(255,255,255,0.0))",
      },
      animation: {
        "shimmer": "shimmer 2s linear infinite",
        "fade-in-up": "fadeInUp 0.8s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" }
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: [typography]
};

export default config;
