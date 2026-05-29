/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        reshka: {
          yellow: '#f6c90e',
          yellowSoft: '#ffe17a',
          black: '#090909',
          graphite: '#171717',
          ash: '#2a2a2a',
        },
      },
      boxShadow: {
        glow: '0 24px 80px rgba(246, 201, 14, 0.24)',
        card: '0 20px 60px rgba(0, 0, 0, 0.12)',
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
        display: ['Manrope', 'Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-hotel':
          'linear-gradient(115deg, rgba(0,0,0,0.72), rgba(0,0,0,0.26) 48%, rgba(0,0,0,0.62)), url("https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=2200&q=85")',
      },
    },
  },
  plugins: [],
};
