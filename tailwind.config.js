/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{jsx,tsx}",
    "./components/**/*.{jsx,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./services/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
    "./views/**/*.{jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Nunito', 'Noto Sans', 'sans-serif'],
        display: ['Fredoka', 'sans-serif'],
        mono: ['"Space Mono"', 'monospace'],
      },
      colors: {
        french: {
          blue: '#0055A4',
          white: '#FFFFFF',
          red: '#EF4135',
          dark: '#1A202C',
        },
        cream: '#faf9f7',
        oat: '#dad4c8',
        'oat-light': '#eee9df',
        'warm-silver': '#9f9b93',
        'warm-charcoal': '#55534e',
        matcha: {
          300: '#84e7a5',
          600: '#078a52',
          800: '#02492a',
        },
        slushie: {
          500: '#3bd3fd',
          800: '#0089ad',
        },
        lemon: {
          400: '#f8cc65',
          500: '#fbbd41',
          700: '#d08a11',
        },
        ube: {
          300: '#c1b0ff',
          800: '#43089f',
          900: '#32037d',
        },
        pomegranate: {
          400: '#fc7981',
        },
        blueberry: {
          800: '#01418d',
        },
      },
      boxShadow: {
        clay: '0px 1px 1px rgba(0,0,0,0.1), 0px -1px 1px rgba(0,0,0,0.04) inset, 0px -0.5px 1px rgba(0,0,0,0.05)',
        'clay-hover': '-4px 4px 0px rgb(0,0,0)',
      },
    },
  },
  plugins: [],
}
