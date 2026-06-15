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
          sidebar: '#0f172a',
          main: '#080d16',
          card: '#1e293b',
          border: '#334155',
          text: '#f8fafc',
          subtext: '#94a3b8'
        },
        light: {
          sidebar: '#f8fafc',
          main: '#f1f5f9',
          card: '#ffffff',
          border: '#cbd5e1',
          text: '#0f172a',
          subtext: '#64748b'
        },
        accent: {
          primary: '#ff6b35', // Cyber Orange
          success: '#2ec4b6', // Teal Accent
          warning: '#f59e0b',
          danger: '#ef4444',
          purple: '#818cf8'
        }
      },
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
        hand: ['Caveat', 'cursive'],
      }
    },
  },
  plugins: [],
}
