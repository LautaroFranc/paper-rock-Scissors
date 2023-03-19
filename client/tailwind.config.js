/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'Home': "url('./src/asses/bg.jpg')"
      }
    },

  },
  plugins: [],
}