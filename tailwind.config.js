/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        cream: "#FFF8F0",
        apricot: "#F5E6D3",
        warmbrown: "#C49A6C",
        coral: "#E8927C",
        sage: "#A3B899",
        "coral-light": "#F2C4B8",
        "sage-light": "#C5D5BF",
        "text-soft": "#6B5E52",
        "text-muted": "#A3968A",
      },
      fontFamily: {
        handwriting: ['Gaegu', 'cursive'],
        body: ['"Noto Sans SC"', 'sans-serif'],
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
        "4xl": "24px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "breathe": "breathe 3s ease-in-out infinite",
        "bloom": "bloom 0.5s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        breathe: {
          "0%, 100%": { boxShadow: "0 4px 20px rgba(232, 146, 124, 0.3)" },
          "50%": { boxShadow: "0 4px 30px rgba(232, 146, 124, 0.5)" },
        },
        bloom: {
          "0%": { transform: "scale(0.95)", opacity: "0.5" },
          "50%": { transform: "scale(1.03)", opacity: "0.9" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};