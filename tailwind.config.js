/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Path ke file proyek Anda
    "node_modules/flowbite-react/lib/esm/**/*.js", // Path ke flowbite-react
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("flowbite/plugin"), 
  ],
};