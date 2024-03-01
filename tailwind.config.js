/** @type {import('tailwindcss').Config} */
 module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {

        barlow: ["Barlow", "Sans-serif"]

      },
      colors: {
        
        'azulceleste': '#e6e6e6',
        'mirage': '#dfdfdf',
        'cyann': '#f8f8f8',
        'fount':'#f7f7f7',
        'map': '#239e71',
        'map-100': '#1b7554'
        
      },
      
    },
  },
  plugins: [],
}

