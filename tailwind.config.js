/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './app.js'],
  theme: {
    extend: {
      boxShadow: {
        soft: '0 10px 25px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
}

