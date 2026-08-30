/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      colors: {
        terracota: '#C1592B',
        grafite: '#2B2622',
        dourado: '#C99A3D',
        osso: '#EDE3D3',
        vinho: '#6E2A2A',
        areia: '#D8C4A0',
      },
      fontFamily: {
        display: ['Oswald', 'sans-serif'],
        body: ['Lora', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
