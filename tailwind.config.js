/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // <-- this is important!
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
