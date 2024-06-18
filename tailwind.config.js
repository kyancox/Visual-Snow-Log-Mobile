/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3d405b",
        secondary: "#005f73",
        main: "#FFF2E6",
        tabbar: "#2C3E50"

    }
    },
  },
  plugins: [],
}

