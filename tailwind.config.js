/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        saffron: {
          light: '#FFC76E',
          DEFAULT: '#FF9933',
          dark: '#E67E22',
        },
        india: {
          green: '#138808',
          blue: '#000080',
          gold: '#C99700',
          cream: '#FFF6E9',
          terracotta: '#B74B2A',
          marigold: '#F4A127',
          night: '#1A1423',
        },
      },
      fontFamily: {
        display: ['"Baloo 2"', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mandala-pattern':
          "radial-gradient(circle at 1px 1px, rgba(201,151,0,0.18) 1px, transparent 0)",
      },
      boxShadow: {
        card: '0 8px 30px -12px rgba(26,20,36,0.18)',
        float: '0 12px 40px -8px rgba(255,153,51,0.55)',
      },
      keyframes: {
        floaty: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        ring: {
          '0%': { transform: 'rotate(0)' },
          '25%': { transform: 'rotate(6deg)' },
          '50%': { transform: 'rotate(-6deg)' },
          '75%': { transform: 'rotate(4deg)' },
          '100%': { transform: 'rotate(0)' },
        },
      },
      animation: {
        floaty: 'floaty 3s ease-in-out infinite',
        ring: 'ring 1s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}