module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['var(--font-poppins)', 'sans-serif'],
      },
      screen:{
        'xs': '393px'
      }
    },
  },
  plugins: [],
};
