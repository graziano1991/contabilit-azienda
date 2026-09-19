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
          950: "#080e1c",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(15 23 42 / 0.06), 0 6px 20px -6px rgb(15 23 42 / 0.10)",
        "card-hover": "0 2px 6px 0 rgb(15 23 42 / 0.08), 0 14px 32px -8px rgb(15 23 42 / 0.18)",
        glow: "0 8px 24px -6px rgb(23 175 156 / 0.35)",
        "glow-lg": "0 16px 48px -12px rgb(23 175 156 / 0.45)",
        ambient: "0 1px 2px 0 rgb(11 26 55 / 0.06), 0 8px 24px -8px rgb(11 26 55 / 0.12), 0 0 0 1px rgb(23 175 156 / 0.04)",
        "inner-glow": "inset 0 1px 0 0 rgb(255 255 255 / 0.08)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #1e3f78 0%, #173263 55%, #108f82 130%)",
        // Sfondo "mesh" per l'area app: macchie di colore molto tenui sopra
        // il grigio piatto, per dare profondità senza distrarre dai dati.
        "mesh-light":
          "radial-gradient(circle at 0% 0%, rgb(23 175 156 / 0.06), transparent 40%), radial-gradient(circle at 100% 0%, rgb(30 63 120 / 0.05), transparent 45%), radial-gradient(circle at 50% 100%, rgb(23 175 156 / 0.04), transparent 50%)",
        // Sweep diagonale usato per lo shimmer degli skeleton di caricamento.
        sheen: "linear-gradient(110deg, transparent 30%, rgb(255 255 255 / 0.7) 50%, transparent 70%)",
      },
      transitionTimingFunction: {
        snappy: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      keyframes: {
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-150% 0" },
          "100%": { backgroundPosition: "150% 0" },
        },
        "glow-pulse": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        blob: {
          "0%, 100%": { transform: "translate(0, 0) scale(1)" },
          "33%": { transform: "translate(3%, -4%) scale(1.05)" },
          "66%": { transform: "translate(-3%, 3%) scale(0.97)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2.4s ease-in-out infinite",
        blob: "blob 14s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
