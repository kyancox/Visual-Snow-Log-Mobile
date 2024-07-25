/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3d405b",
        secondary: "#005f73",
        main: "#FFF2E6",
        tabbar: "#08080f",
        projectOrange: '#FFA500'

    }
    },
    fontFamily: {
      pbold: ['PlusJakartaSans-Bold', 'sans-serif'],
      pextrabold: ['PlusJakartaSans-ExtraBold', 'sans-serif'],
      pextralight: ['PlusJakartaSans-ExtraLight', 'sans-serif'],
      plight: ['PlusJakartaSans-Light', 'sans-serif'],
      pmedium: ['PlusJakartaSans-Medium', 'sans-serif'],
      pregular: ['PlusJakartaSans-Regular', 'sans-serif'],
      psemibold: ['PlusJakartaSans-SemiBold', 'sans-serif'],
    }
  },
  plugins: [],
}

