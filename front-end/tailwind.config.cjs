/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    
    maxWidth:{
      main:'1300px'
    },
    extend: {
      colors:{
        dark:"#002333",
        myblue:"#159A9C",
        mylight:"#DEEFE7",
        mygray:"#B4BEC9",
        darkblue:'rgb(3,37,65)'
      }
    },
  },
  plugins: [],
}
