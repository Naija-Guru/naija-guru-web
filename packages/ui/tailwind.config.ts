import type { Config } from 'tailwindcss';

import defaultConfig from '@naija-spell-checker/tailwind/config';

const config: Config = {
  ...defaultConfig,
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
};

export default config;
