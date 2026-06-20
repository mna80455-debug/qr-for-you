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
        background: '#F8FAFC',
        card: '#FFFFFF',
        accent: {
          DEFAULT: '#2563EB',
          hover: '#1D4ED8',
        },
        secondary: '#8B5CF6',
        highlight: '#06B6D4',
        border: '#E2E8F0',
        textDark: '#0F172A',
        textMuted: '#64748B',
        // Memory Themes colors
        qrWebsite: '#3B82F6',
        qrAttendance: '#10B981',
        qrRestaurant: '#F59E0B',
        qrEvent: '#8B5CF6',
        qrPersonal: '#EC4899',
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
