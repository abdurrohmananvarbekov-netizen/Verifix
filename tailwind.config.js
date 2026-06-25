/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // SIFCO brand colors
        brand: {
          50:  '#e6f2f7',
          100: '#cce5ef',
          200: '#99cbe0',
          300: '#66b1d0',
          400: '#3397c1',
          500: '#007dab',
          600: '#005278', // SIFCO primary
          700: '#004062',
          800: '#002e47',
          900: '#001c2c'
        },
        accent: {
          50:  '#fff4e6',
          100: '#ffe9cc',
          200: '#ffd399',
          300: '#ffbd66',
          400: '#ffa733',
          500: '#f17f00', // SIFCO orange
          600: '#c16600',
          700: '#914d00',
          800: '#613300',
          900: '#301a00'
        },
        surface: {
          950: '#070b14',
          900: '#0d1321',
          850: '#111827',
          800: '#172033',
          700: '#202c43'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        soft:  '0 12px 32px rgba(0,0,0,0.28)',
        brand: '0 0 20px rgba(0, 82, 120, 0.35)',
        glow:  '0 0 30px rgba(241, 127, 0, 0.2)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        }
      }
    }
  },
  plugins: []
}
