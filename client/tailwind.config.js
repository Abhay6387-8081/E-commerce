/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#FFF8ED',
          100: '#FFEFD3',
          500: '#F97316',
          600: '#EA580C',
          700: '#C2410C',
        },
        surface: {
          bg: '#FAFAF9',
          card: '#FFFFFF',
          dark: '#1C1917',
        },
        ink: {
          900: '#1C1917',
          700: '#44403C',
          500: '#78716C',
          300: '#D6D3D1',
        },
        success: '#16A34A',
        danger: '#DC2626',
        warning: '#D97706',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        cardHover: '0 8px 20px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
};

