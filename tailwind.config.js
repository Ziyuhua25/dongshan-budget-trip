/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        coast: {
          50: '#edfafa',
          100: '#d1f1ef',
          500: '#1f9ca7',
          700: '#126a76',
        },
        sand: '#f6efdf',
        coral: '#ef7b45',
        ink: '#263238',
      },
      boxShadow: {
        soft: '0 18px 45px rgba(31, 156, 167, 0.13)',
      },
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
    },
  },
  plugins: [],
};
