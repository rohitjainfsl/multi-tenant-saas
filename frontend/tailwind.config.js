/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dce7ff',
          200: '#b9cffe',
          300: '#85adfb',
          400: '#5a87f7',
          500: '#3b63f2',
          600: '#2445e7',
          700: '#1c35c8',
          800: '#1d2fa2',
          900: '#1e2d7e',
          950: '#161d4f',
        },
      },
    },
  },
  plugins: [],
};

