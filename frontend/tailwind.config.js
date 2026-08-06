/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1F3864',
        secondary: '#2E75B6',
        accent: '#BF8F00',
      }
    },
  },
  plugins: [],
}