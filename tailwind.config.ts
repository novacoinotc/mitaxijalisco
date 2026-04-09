import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Paleta oficial Mi Taxi Jalisco — naranja cálido + negro
        jalisco: {
          50: "#fff7ed",
          100: "#ffedd5",
          200: "#fed7aa",
          400: "#fb923c",
          500: "#ea6a1a",   // naranja principal Jalisco
          600: "#c2410c",
          700: "#9a3412",
          800: "#7c2d12",
          900: "#1a0a00",   // casi negro cálido
          950: "#0a0500",
        },
        // Tokens "neon" remapeados a la nueva paleta para mantener compatibilidad
        // con el resto del código sin tocar componentes.
        neon: {
          pink: "#f97316",    // naranja brillante
          cyan: "#ea6a1a",    // naranja principal
          lime: "#fbbf24",    // ámbar dorado (éxito)
          violet: "#7c2d12",  // marrón-naranja profundo
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        "gradient-x": "gradient-x 8s ease infinite",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-x": {
          "0%,100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
