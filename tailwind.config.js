/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-pink': '#ff0099',
        'brand-black': '#1a1a1a',
        'dark-bg': '#0a0a0f',
        'dark-card': '#1a1a20',
        'dark-input': '#242430',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 15px rgba(255, 0, 153, 0.3)',
      },
    },
  },
  plugins: [],
}; 