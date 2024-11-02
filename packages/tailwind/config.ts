import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [],
  theme: {
    extend: {
      fontFamily: {
        header: ['var(--font-cabinet-grotesk)'],
        body: ['var(--font-poppins)'],
      },
      colors: {
        primary: 'var(--primary)',
        'primary-foreground': 'hsl(var(--primary-foreground))',
        secondary: 'var(--secondary)',
        'secondary-foreground': 'var(--secondary-foreground)',
        green: '#0e3f30',
        'light-green': '#a9bd89',
        orange: '#d08c51',
        red: '#af5040',
        grey: '#d3cec4',
        yellow: '#bd9033',
        background: 'var(--background)',
        foreground: 'hsl(var(--foreground))',
        card: 'hsl(var(--card))',
        'card-foreground': 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        'popover-foreground': 'hsl(var(--popover-foreground))',
        muted: 'var(--muted)',
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        'accent-foreground': 'hsl(var(--accent-foreground))',
        destructive: 'var(--destructive)',
        'destructive-foreground': 'hsl(var(--destructive-foreground))',
        warning: 'var(--warning)',
        'warning-foreground': 'hsl(var(--warning-foreground))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
export default config;
