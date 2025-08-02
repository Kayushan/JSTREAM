import { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'j-stream-red': '#8B0000',
        'j-stream-pink': '#FF69B4',
        'j-stream-dark-pink': '#C71585',
        'j-stream-black': '#000000',
        'j-stream-dark': '#1a1a1a',
        'j-stream-gray': '#404040',
        'j-stream-light-gray': '#E5E5E5',
      },
      fontFamily: {
        'j-stream': ['Helvetica Neue', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config 