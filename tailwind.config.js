/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Main Brand Colors
        primary: "#184098",      // Deep Blue (Secondary School Logo) - Main color
        secondary: "#FE6240",    // Coral/Orange (General Logo)

        // Supporting Colors
        accent: "#0F2C6B",       // Darker version of primary (for hover/active)
        highlight: "#FF7A55",    // Lighter version of secondary

        // Neutrals
        dark: "#1A1A1A",
        gray: "#4B5563",
        light: "#F8FAFC",
        white: "#FFFFFF",
      },
      fontFamily: {
         heading: ['"Playfair Display"', 'serif'],
        body: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [],
};