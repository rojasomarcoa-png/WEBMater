/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#edfaf4',
          100: '#d3f2e3',
          200: '#a7e4c9',
          300: '#6fcfa8',
          400: '#38b487',
          500: '#15996d',
          600: '#0c7a58',
          700: '#0c6249',
          800: '#0b4e3b',
          900: '#094031',
          950: '#04231b',
        },
        accent: {
          50: '#eefdfb',
          100: '#cffaf4',
          200: '#a0f3e9',
          300: '#62e6d9',
          400: '#2ccfc4',
          500: '#10b0ab',
          600: '#0c8d8c',
          700: '#0f7172',
          800: '#115a5c',
          900: '#134b4d',
          950: '#042e30',
        },
        ink: {
          50: '#f4f7f6',
          100: '#e8efed',
          200: '#cddad7',
          300: '#a3bcb6',
          400: '#71978f',
          500: '#547a72',
          600: '#42625c',
          700: '#374f4a',
          800: '#2e403c',
          900: '#1f2c2a',
          950: '#0f1817',
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', 'ui-serif', 'Georgia', 'serif'],
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(12, 98, 73, 0.08), 0 4px 24px -4px rgba(12, 98, 73, 0.06)',
        card: '0 1px 3px rgba(15, 46, 42, 0.06), 0 8px 32px -12px rgba(15, 46, 42, 0.12)',
        lift: '0 12px 40px -8px rgba(12, 98, 73, 0.22), 0 4px 16px -4px rgba(12, 98, 73, 0.12)',
        glow: '0 0 0 1px rgba(21, 153, 109, 0.12), 0 8px 30px -6px rgba(21, 153, 109, 0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'ken-burns': {
          '0%': { transform: 'scale(1) translateY(0)' },
          '100%': { transform: 'scale(1.12) translateY(-2%)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.8s ease both',
        'scale-in': 'scale-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'ken-burns': 'ken-burns 12s ease-out both',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 2s infinite',
      },
    },
  },
  plugins: [],
};
