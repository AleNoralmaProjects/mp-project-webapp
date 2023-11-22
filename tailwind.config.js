/** @type {import('tailwindcss').Config} */
 module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        
       lustria: [ "Lustria", "Cambria", "Georgia"]
      /*    maitree: [ "Maitree", "Cambria", "Georgia"]  */
      },
      colors: {
        
        'azulceleste': '#e6e6e6',
        'mirage': '#dfdfdf',
        'cyann': '#f8f8f8',
        'fount':'#f7f7f7'
      },
      
    },
  },
  plugins: [],
}

