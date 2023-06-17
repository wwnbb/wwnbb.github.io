/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./src/**/*.{jsx,tsx}", "./public/index.html"],
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["wireframe",],
  },
}
