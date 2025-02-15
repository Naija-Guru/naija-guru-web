import defaultConfig from '@naija-spell-checker/tailwind/config';

/** @type {import('tailwindcss').Config} */
export default {
  ...defaultConfig,
  content: [
    './*.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@naija-spell-checker/ui/**/*.{js,ts,jsx,tsx}',
  ],
};
