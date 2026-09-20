import type { Config } from "tailwindcss";

// Identità visiva "ultra premium" del 2026: l'app intera è passata da un
// tema chiaro a un tema scuro/glass con accenti vivaci (viola → fucsia →
// ciano) e sfondo animato. Il trucco che rende possibile ridisegnare TUTTE
// le pagine senza riscrivere ogni singolo file: la stragrande maggioranza
// delle pagine usa già i token condivisi (neutral-*, brand-*, accent-*,
// shadow-ambient/card/glow, bg-white, animate-fade-in-up…) definiti qui.
// Ridefinendo i VALORI di questi token — scala "neutral" invertita
// (i numeri bassi diventano superfici scure, i numeri alti diventano testo
// chiaro), "brand"/"accent" spostati su tonalità vivide da tema scuro,
// ombre trasformate da "shadow" a "glow" — l'intera interfaccia si
// riskina in un colpo solo, in modo coerente, anche nelle pagine che non
// sono state riscritte riga per riga.
const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Viola/indigo: colore "hero" del brand, usato per azioni primarie,
        // testo "utile/profit" e accenti di gerarchia. Scala invertita
        // rispetto a Tailwind standard: 50 = quasi nero (superfici/tint
        // scuri), 900 = quasi bianco (testo chiaro su sfondo scuro).
        brand: {
          50: "#0b0a1a",
          100: "#130f2b",
          200: "#211a46",
          300: "#372a6e",
          400: "#5b3fa8",
          500: "#7c3aed",
          600: "#9061f9",
          700: "#b79dfb",
          800: "#d6c8fd",
          900: "#efe9fe",
        },
        // Ciano/turchese: accento secondario, focus ring, dettagli vivaci.
        accent: {
          50: "#04141a",
          100: "#07242e",
          200: "#0b3c4a",
          300: "#0e6478",
          400: "#0891a8",
          500: "#06b6d4",
          600: "#22d3ee",
          700: "#7ee7f7",
          800: "#b3f2fa",
          900: "#e0fbff",
        },
        // Magenta/fucsia: terzo colore dell'identità cromatica, usato nei
        // gradienti premium (bottoni, testo in evidenza, bordi luminosi).
        glow: {
          50: "#170a17",
          100: "#2a0f2a",
          200: "#4a1a4a",
          300: "#7a2a7a",
          400: "#b23bb2",
          500: "#d946ef",
          600: "#e879f9",
          700: "#f0abfc",
          800: "#f5d0fe",
          900: "#fdf4ff",
        },
        revenue: "#34d399",
        cost: "#fb7185",
        // Scala "neutral" completamente invertita: nell'app originale (tema
        // chiaro) 50 era quasi bianco e 900 quasi nero. Qui è il contrario,
        // apposta: ogni "bg-neutral-50", "border-neutral-200",
        // "text-neutral-900" ecc. già scritto in ~30 pagine continua a
        // funzionare, ma ora produce superfici scure e testo chiaro invece
        // che il contrario, senza dover toccare quelle pagine una per una.
        neutral: {
          50: "#05060d",
          100: "#0a0c17",
          200: "#141726",
          300: "#1f2437",
          400: "#7d84a0",
          500: "#9aa1ba",
          600: "#b6bcd1",
          700: "#d2d5e4",
          800: "#e8eaf2",
          900: "#f8f9fc",
          950: "#ffffff",
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
        // Stessi nomi di prima (ambient/card/card-hover/glow/glow-lg):
        // cambiano i valori, non le classi già usate ovunque nell'app, così
        // ogni Card/KpiCard/bottone/tabella riceve automaticamente ombre
        // "glow" da tema scuro invece delle vecchie ombre morbide chiare.
        ambient: "0 1px 0 0 rgb(255 255 255 / 0.04) inset, 0 12px 32px -12px rgb(0 0 0 / 0.55)",
        card: "0 1px 0 0 rgb(255 255 255 / 0.05) inset, 0 8px 24px -8px rgb(0 0 0 / 0.5)",
        "card-hover": "0 1px 0 0 rgb(255 255 255 / 0.08) inset, 0 20px 48px -12px rgb(124 58 237 / 0.35), 0 0 0 1px rgb(124 58 237 / 0.15)",
        glow: "0 0 24px -4px rgb(124 58 237 / 0.55)",
        "glow-lg": "0 0 48px -8px rgb(124 58 237 / 0.6), 0 0 96px -16px rgb(217 70 239 / 0.35)",
        "glow-cyan": "0 0 24px -4px rgb(34 211 238 / 0.55)",
        "glow-fuchsia": "0 0 24px -4px rgb(217 70 239 / 0.55)",
        "glow-emerald": "0 0 24px -6px rgb(52 211 153 / 0.45)",
        "glow-rose": "0 0 24px -6px rgb(251 113 133 / 0.45)",
        "inner-glow": "inset 0 1px 0 0 rgb(255 255 255 / 0.08)",
        "glass-border": "inset 0 0 0 1px rgb(255 255 255 / 0.08)",
      },
      backgroundImage: {
        // Gradiente "hero" viola → fucsia → ciano: la firma cromatica di
        // bottoni, testo in evidenza e bordi luminosi in tutta l'app.
        "premium-gradient": "linear-gradient(115deg, #7c3aed 0%, #d946ef 50%, #22d3ee 100%)",
        "premium-gradient-soft": "linear-gradient(115deg, rgb(124 58 237 / 0.18) 0%, rgb(217 70 239 / 0.14) 50%, rgb(34 211 238 / 0.14) 100%)",
        "brand-gradient": "linear-gradient(135deg, #4c1d95 0%, #7c3aed 45%, #0891a8 100%)",
        // Sfondo "aurora": la superficie scura di base dell'intera app (sia
        // il guscio /app che login/security-gate), con macchie di colore
        // molto sfumate che si muovono lentamente grazie a @keyframes
        // aurora-drift più sotto — questo è il "background dinamico" che
        // sostituisce il vecchio sfondo bianco piatto.
        "aurora-mesh":
          "radial-gradient(ellipse 80% 60% at 15% 10%, rgb(124 58 237 / 0.35), transparent 55%), radial-gradient(ellipse 70% 60% at 85% 15%, rgb(217 70 239 / 0.28), transparent 55%), radial-gradient(ellipse 80% 70% at 50% 100%, rgb(6 182 212 / 0.25), transparent 60%), radial-gradient(ellipse 60% 50% at 90% 90%, rgb(52 211 153 / 0.12), transparent 55%), #05050c",
        sheen: "linear-gradient(110deg, transparent 30%, rgb(255 255 255 / 0.14) 50%, transparent 70%)",
        "grid-dots": "radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.07) 1px, transparent 0)",
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
        // Movimento lentissimo (24s) delle macchie di colore dello sfondo
        // "aurora": solo transform + opacity (GPU-friendly, no reflow), per
        // dare la sensazione di un'app "viva" senza costare performance.
        "aurora-drift": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)", opacity: "0.9" },
          "50%": { transform: "translate3d(2%, -3%, 0) scale(1.08)", opacity: "1" },
        },
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
      },
      animation: {
        "fade-in-up": "fade-in-up 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        "scale-in": "scale-in 0.3s cubic-bezier(0.2, 0.8, 0.2, 1) both",
        shimmer: "shimmer 1.8s ease-in-out infinite",
        "glow-pulse": "glow-pulse 2.4s ease-in-out infinite",
        blob: "blob 14s ease-in-out infinite",
        "aurora-drift": "aurora-drift 24s ease-in-out infinite",
        "gradient-pan": "gradient-pan 6s ease-in-out infinite",
        float: "float 5s ease-in-out infinite",
      },
      backgroundSize: {
        "gradient-pan": "200% 200%",
      },
    },
  },
  plugins: [],
};

export default config;
