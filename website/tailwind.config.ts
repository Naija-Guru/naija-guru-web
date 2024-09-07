import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        header: ['var(--font-cabinet-grotesk)'],
        body: ['var(--font-poppins)'],
      },
      colors: {
        primary: '#0e3f30',
        secondary: '#d3cec4',
        green: '#0e3f30',
        'light-green': '#a9bd89',
        orange: '#d08c51',
        red: '#af5040',
        grey: '#d3cec4',
        yellow: '#bd9033',
      },
    },
  },
  plugins: [],
};
export default config;
