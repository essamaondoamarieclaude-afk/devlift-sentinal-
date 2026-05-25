/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sentinel: {
          bg: '#0A0E1A',
          surface: '#161B27',
          cyan: '#00D4FF',
          blue: '#4A9EFF',
          purple: '#7C5CFF',
          green: '#00FF88',
          orange: '#FF6B35',
          text: {
            primary: '#FFFFFF',
            secondary: '#CDD5E0',
            muted: '#8892A4',
          },
          border: '#1E2D40',
        }
      },
      fontFamily: {
        display: ['Inter', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      backgroundImage: {
        'dotted-grid': 'radial-gradient(circle, #1E2D40 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid-size': '20px 20px',
      }
    },
  },
  plugins: [],
}
