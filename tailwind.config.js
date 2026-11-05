/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        bold: '800',
        extrabold: '800',
        black: '800',
      },
      colors: {
        navy: {
          700: '#16243d',
          800: '#0f1c30',
          900: '#0a1426',
          950: '#050b14',
        },
        gold: {
          200: '#f8e7a6',
          300: '#f3d978',
          400: '#e8c547',
          500: '#d4af37',
          600: '#a8862a',
        },
      },
      boxShadow: {
        gold: '0 0 20px rgba(232, 197, 71, 0.22)',
        'gold-lg': '0 0 32px rgba(232, 197, 71, 0.4)',
        'gold-ring': '0 0 24px rgba(232, 197, 71, 0.3), inset 0 0 12px rgba(232, 197, 71, 0.15)',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        modalIn: {
          from: { opacity: '0', transform: 'translateY(18px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.45s ease-out both',
        'modal-in': 'modalIn 0.35s cubic-bezier(0.2, 0.8, 0.2, 1) both',
      },
    },
  },
  plugins: [],
};
