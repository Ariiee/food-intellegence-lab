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
        paper: {
          50: '#FDFBF7',
          100: '#F9F6F0',
          200: '#F2ECE1',
          300: '#E6DCCB',
          400: '#D5C5AC',
          800: '#3D3429',
          900: '#1C1917',
        },
        spice: {
          saffron: '#D97706',
          turmeric: '#EAB308',
          terracotta: '#C2410C',
          amber: '#B45309',
          brown: '#78350F',
          dark: '#292524',
        },
        accent: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
          border: '#FDE68A',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'paper-sm': '0 1px 3px 0 rgba(120, 53, 15, 0.05), 0 1px 2px -1px rgba(120, 53, 15, 0.05)',
        'paper-md': '0 4px 6px -1px rgba(120, 53, 15, 0.07), 0 2px 4px -2px rgba(120, 53, 15, 0.05)',
        'paper-lg': '0 10px 25px -5px rgba(120, 53, 15, 0.1), 0 8px 10px -6px rgba(120, 53, 15, 0.05)',
        'glow-amber': '0 0 25px -5px rgba(217, 119, 6, 0.25)',
      }
    },
  },
  plugins: [],
}
