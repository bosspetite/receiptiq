/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0f172a',
          light: '#1e293b',
          lighter: '#334155',
        },
        accent: {
          DEFAULT: '#14b8a6',
          dark: '#0d9488',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Manrope', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
