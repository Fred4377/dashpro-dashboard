/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          sidebar: '#0D1117',
          main: '#161B22',
          card: '#1C2128',
          border: '#30363D',
          text: '#E6EDF3',
          subtext: '#8B949E'
        },
        light: {
          sidebar: '#1E293B',
          main: '#F8FAFC',
          card: '#FFFFFF',
          border: '#E2E8F0',
          text: '#0F172A',
          subtext: '#64748B'
        },
        accent: {
          primary: '#1E90FF',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
