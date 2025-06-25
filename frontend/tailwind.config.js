// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
   theme: {
    extend: {
      animation: {
        slowSpin: 'spin 10s linear infinite',
      },
    },
  },
  plugins: [],
}
