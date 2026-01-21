/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      animation: {
        'flash': 'flashGreen 2s ease-out'
    },
    keyframes: {
        'flashGreen': {
          '0%': { backgroundColor: '#d4edda' }, 
          '100%': { backgroundColor: 'transparent' }, 
            
        }
    }
    },
  },
  plugins: [],
}

  
