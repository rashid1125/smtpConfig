/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    '.app/Helpers/**/*.php',
    './resources/views/**/*.php',
    './public/assets/js/app_modules/**/*.js',
    './resources/js/**/*.js',
  ],
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('tailwindcss-children'),
  ],
  variants: {
    extend: {
      backgroundColor: ['responsive', 'hover', 'focus', 'group-hover'],
    }
  }
};
