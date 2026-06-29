/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", 
    "./global.css"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        p1:'#3FFC89',
        p2:'#49C6FC',
        text1 :'#D7E9FE',
        text2:'#A8F8D6'
      }
    },
  },
  plugins: [],
}