import type { Config } from 'tailwindcss';

import defaultConfig from '@naija-spell-checker/tailwind/config';

const config: Config = {
  ...defaultConfig,
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    '../../node_modules/@naija-spell-checker/ui/**/*.{js,ts,jsx,tsx}',
  ],
};
export default config;
