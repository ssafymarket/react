/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#034EA2',
          50: '#E6EDF6',
          100: '#CCDBED',
          500: '#034EA2',
          600: '#023D82',
          700: '#022C62',
        },
        danger: {
          DEFAULT: '#EF4444',
          500: '#EF4444',
        },
        gray: {
          50: '#F9FAFB',
          100: '#E6EDF6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#ADAEBC',
          500: '#9CA3AF',
          600: '#4B5563',
          700: '#374151',
          900: '#111827',
        },
      },
      maxWidth: {
        'content': '1440px',
      },
      spacing: {
        'header': '64px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
}
