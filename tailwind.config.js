/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          700: "#573721ff", // café medio
          800: "#4E2C1E", // café oscuro
        },
        coffee: {
          light: "#d8c0a4ff", // tono latte
          DEFAULT: "#8B5E3C", // café clásico
          dark: "#3E2723", // espresso fuerte
        },
      },
    },
  },
  plugins: [],
}
