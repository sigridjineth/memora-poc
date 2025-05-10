/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        'navy-dark': '#0d1117', // Very dark blue, almost black
        'navy-medium': '#161b22', // Dark blue-gray
        'navy-light': '#21262d', // Lighter blue-gray
        'accent-purple': '#8a63d2',
        'accent-pink': '#e91e63',
        'accent-blue': '#2196f3',
        'gray-dark': '#30363d',
        'gray-medium': '#8b949e',
        'gray-light': '#c9d1d9',
        'green-positive': '#2da44e',
        'red-negative': '#f85149',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
  ],
}
