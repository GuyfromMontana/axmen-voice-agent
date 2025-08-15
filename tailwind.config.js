/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',       // Root HTML file
    './src/**/*.{js,jsx,ts,tsx}',  // All JS/TS/React files in src
  ],
  theme: {
    extend: {},           // Add customizations here if needed
  },
  plugins: [],            // Add Tailwind plugins here if needed
};
