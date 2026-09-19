import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#eef3fb",
          100: "#dbe5f6",
          200: "#b3c9ea",
          300: "#82a4da",
          400: "#4f78bf",
          500: "#2f5596",
          600: "#1e3f78",
          700: "#173263",
          800: "#11254d",
          900: "#0b1a37",
        },
        accent: {
          50: "#ecfdf6",
          100: "#d1faec",
          200: "#a4f4db",
          300: "#6ee8c5",
          400: "#3ad4a8",
          500: "#17af9c",
          600: "#108f82",
          700: "#0d7268",
          800: "#0f5b54",
          900: "#0f4a46",
        },
        revenue: "#15a385",
        cost: "#c0392b",
        neutral: {
          50: "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          400: "#94a3b8",
          500: "#64748b",
          600: "#475569",
          700: "#334155",
          800: "#1e293b",
          900: "#0f172a",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 4px 16px -4px rgb(15 23 42 / 0.08)",
        "card-hover": "0 2px 4px 0 rgb(15 23 42 / 0.06), 0 12px 28px -8px rgb(15 23 42 / 0.16)",
        glow: "0 8px 24px -6px rgb(23 175 156 / 0.35)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #1e3f78 0%, #173263 55%, #108f82 130%)",
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
