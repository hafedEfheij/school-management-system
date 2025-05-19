module.exports = {
  plugins: {
    '@tailwindcss/postcss': {
      content: [
        './src/**/*.{js,jsx,ts,tsx}',
        './app/**/*.{js,jsx,ts,tsx}',
        './components/**/*.{js,jsx,ts,tsx}',
      ],
    },
    autoprefixer: {},
  },
}
