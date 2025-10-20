/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      /* 🎨 Colores personalizados */
      colors: {
        brown: {
          700: "#573721", // café medio
          800: "#4E2C1E", // café oscuro
        },
        coffee: {
          light: "#EAD8C0", // tono latte
          DEFAULT: "#A47C5E", // café clásico
          dark: "#3E2723", // espresso fuerte
        },
        accent: "#B08968", // tono elegante para botones y detalles
      },

      /* ✍️ Fuentes personalizadas (las mismas del globals.css) */
      fontFamily: {
        title: ["Playfair Display", "serif"],
        sans: ["Poppins", "sans-serif"],
      },

      /* 🧱 Sombras suaves tipo tarjetas */
      boxShadow: {
        soft: "0 4px 10px rgba(0, 0, 0, 0.1)",
        hover: "0 6px 16px rgba(0, 0, 0, 0.15)",
      },

      /* 🪶 Bordes y animaciones suaves */
      borderRadius: {
        "2xl": "1.5rem",
      },
      transitionDuration: {
        DEFAULT: "300ms",
      },
    },
  },
  plugins: [],
};
