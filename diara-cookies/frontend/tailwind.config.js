/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2e9',
          100: '#fae6d3',
          200: '#f5d7b8',
          300: '#edb792',
          400: '#e29163',
          500: '#d2691e', // warna utama (coklat)
          600: '#c05a18',
          700: '#a0522d', // warna sekunder
          800: '#8d492a',
          900: '#783e24',
          950: '#5a2e1f',
        },
        secondary: {
          50: '#e6f4ea',
          100: '#d1f0e0',
          200: '#a8e6c7',
          300: '#6dd8a3',
          400: '#3cc889',
          500: '#25D366', // hijau WhatsApp
          600: '#128C7E',
          700: '#075E54',
          800: '#084B40',
          900: '#093e35',
        },
        neutral: {
          50: '#fafaf9',
          100: '#f5f5f4',
          200: '#e7e5e4',
          300: '#d6d3d1',
          400: '#a8a29e',
          500: '#78716c',
          600: '#57534e',
          700: '#44403c',
          800: '#292524',
          900: '#1c1917',
        }
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        heading: ['"Poppins"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'hover-scale': 'hoverScale 0.3s ease-in-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        hoverScale: {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        }
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
          },
        },
      }
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    // Daftar kelas-kelas yang mungkin dinamis dan perlu disertakan
    {
      pattern: /(bg|text|border)-(primary|secondary)-(50|100|200|300|400|500|600|700|800|900)/,
    },
    {
      pattern: /text-(3xl|4xl|5xl|6xl)/,
    },
    {
      pattern: /md:text-(xl|2xl|3xl|4xl|5xl|6xl)/,
    },
    {
      pattern: /grid-cols-(1|2|3|4)/,
    },
    {
      pattern: /gap-(1|2|3|4|5|6|8)/,
    },
    {
      pattern: /p-(4|6|8)/,
    },
    {
      pattern: /rounded-(lg|xl)/,
    },
  ],
}