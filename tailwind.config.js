/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./src/**/*.css",
  ],
  theme: {
    extend: {
      screens: {
        'fullhd': '1920px',
      },
      colors: {
        primary: 'rgb(var(--color-primary) / <alpha-value>)',
        secondary: 'rgb(var(--color-secondary) / <alpha-value>)',
        background: 'rgb(var(--color-background) / <alpha-value>)',
        text: 'rgb(var(--color-text) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
      },
    },
  plugins: [],
}
