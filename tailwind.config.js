/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5EFEB',
        card: '#FFFDFB',
        accent: {
          DEFAULT: '#C2652A',
          hover: '#A34F1E',
        },
        secondary: '#78706A',
        highlight: '#8C3C3C',
        border: '#E7DDD3',
        textDark: '#36302B',
        textMuted: '#78706A',
        // Memory Themes colors
        qrWebsite: '#C2652A',
        qrAttendance: '#78706A',
        qrRestaurant: '#8C3C3C',
        qrEvent: '#605850',
        qrPersonal: '#A34F1E',
      },
      fontFamily: {
        display: ['Cairo', 'Plus Jakarta Sans', 'sans-serif'],
        body: ['Cairo', 'Plus Jakarta Sans', 'sans-serif'],
      },
      borderRadius: {
        card: '16px',
        btn: '10px',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 4px 12px 0 rgba(0, 0, 0, 0.03)',
      }
    },
  },
  plugins: [],
}
