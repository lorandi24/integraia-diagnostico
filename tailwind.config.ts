import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta IntegraIA by EMET
        abyss: {
          DEFAULT: "#050B18", // Negro profundo (fondo)
          900: "#07122A", // Azul marino
          800: "#0B1A3A",
          700: "#112452",
        },
        electric: {
          DEFAULT: "#00E5FF", // Cian / turquesa eléctrico
          400: "#33EBFF",
          600: "#00B8D4",
        },
        teal: {
          DEFAULT: "#14B8A6", // Verde azulado
          400: "#2DD4BF",
          600: "#0D9488",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #00E5FF 0%, #14B8A6 100%)",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(0,229,255,.25), 0 10px 40px -10px rgba(0,229,255,.35)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .45s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
