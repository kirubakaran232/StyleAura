/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      colors: {
        primary: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        pinterest: '#E60023',
        amazon:   '#FF9900',
        surface: {
          light: '#ffffff',
          dark:  '#0f0f0f',
        },
      },
      animation: {
        'fade-in':      'fadeIn 0.5s ease-in-out',
        'slide-up':     'slideUp 0.4s ease-out',
        'slide-in':     'slideIn 0.3s ease-out',
        'pulse-slow':   'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-light': 'bounceLight 1s infinite',
        shimmer:        'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn:      { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:     { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideIn:     { '0%': { opacity: '0', transform: 'translateX(-20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        bounceLight: { '0%,100%': { transform: 'translateY(-5%)' }, '50%': { transform: 'translateY(0)' } },
        shimmer:     { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backgroundImage: {
        'gradient-radial':    'radial-gradient(var(--tw-gradient-stops))',
        'hero-gradient':      'linear-gradient(135deg, #9f1239 0%, #1f2937 52%, #e11d48 100%)',
        'card-gradient':      'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 100%)',
        'shimmer-gradient':   'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
      },
      boxShadow: {
        card:   '0 4px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.15)',
        glow:   '0 0 20px rgba(244, 63, 94, 0.28)',
        'glow-amber': '0 0 20px rgba(255, 153, 0, 0.4)',
      },
      borderRadius: { xl: '1rem', '2xl': '1.5rem', '3xl': '2rem' },
      aspectRatio: { pinterest: '2 / 3' },
    },
  },
  plugins: [],
};
