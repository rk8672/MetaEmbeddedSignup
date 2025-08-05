// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlue: "#006699",
        brandTeal: "#00B3B3",
        brandAqua: "#33CCCC",
      },
      animation: {
        fadeIn: 'fadeIn 1.2s ease-out',
        fadeInSlow: 'fadeIn 2.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(-10px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
