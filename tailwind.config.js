/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
        },
        emergency: {
          red: '#dc2626',
          darkRed: '#991b1b',
          amber: '#d97706',
          dark: '#0f172a',
          surface: '#1e293b'
        }
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'dash': 'dash 2s linear infinite',
      },
      keyframes: {
        dash: {
          to: {
            strokeDashoffset: '-20',
          },
        }
      }
    },
  },
  plugins: [],
}
