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
        projectOrange: '#FFA500',
        border: '#EBECEC',
        placeholder: '#888',
        background: '#eff3f9'
    }
    },
    fontFamily: {
      oblack: ['Onest-Black', 'sans-serif'],
      obold: ['Onest-Bold', 'sans-serif'],
      oextrabold: ['Onest-ExtraBold', 'sans-serif'],
      oextralight: ['Onest-ExtraLight', 'sans-serif'],
      olight: ['Onest-Light', 'sans-serif'],
      omedium: ['Onest-Medium', 'sans-serif'],
      o: ['Onest-Regular', 'sans-serif'],
      osemibold: ['Onest-SemiBold', 'sans-serif'],
      othin: ['Onest-Thin', 'sans-serif'],
    }
  },
  plugins: [],
}

