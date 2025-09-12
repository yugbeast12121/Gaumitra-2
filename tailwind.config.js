/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'figtree': ['Figtree', 'sans-serif'],
      },
      animation: {
        'glow-border': 'glow-border 3s ease-in-out infinite alternate',
        'green-light': 'green-light 2s linear infinite',
      },
      keyframes: {
        'glow-border': {
          '0%': {
            'box-shadow': '0 0 20px #ff0080, 0 0 40px #ff0080, 0 0 60px #ff0080',
          },
          '25%': {
            'box-shadow': '0 0 20px #0080ff, 0 0 40px #0080ff, 0 0 60px #0080ff',
          },
          '50%': {
            'box-shadow': '0 0 20px #80ff00, 0 0 40px #80ff00, 0 0 60px #80ff00',
          },
          '75%': {
            'box-shadow': '0 0 20px #ff8000, 0 0 40px #ff8000, 0 0 60px #ff8000',
          },
          '100%': {
            'box-shadow': '0 0 20px #8000ff, 0 0 40px #8000ff, 0 0 60px #8000ff',
          },
        },
        'green-light': {
          '0%': {
            'box-shadow': '0 0 0 0 rgba(34, 197, 94, 0.4)',
            'border-color': 'rgba(34, 197, 94, 0.2)',
          },
          '50%': {
            'box-shadow': '0 0 15px 2px rgba(34, 197, 94, 0.6)',
            'border-color': 'rgba(34, 197, 94, 0.8)',
          },
          '100%': {
            'box-shadow': '0 0 0 0 rgba(34, 197, 94, 0.4)',
            'border-color': 'rgba(34, 197, 94, 0.2)',
          },
        },
      },
    },
  },
  plugins: [],
};