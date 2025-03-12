import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        olive: {
          light: '#2f0b33',
          // light: '#471849',
          DEFAULT: '#471849',
          // DEFAULT: '#2f0b33',
          dark: '#17051c',
        },
        khaki: {
          DEFAULT: '#B5A642',
          light: '#C6B855',
          dark: '#8C7F32',
          // light: '#8ee6e9',
          // DEFAULT: '#75e0e4',
          // dark: '#5cbabf',
        },
        brass: {
          light: '#8ee6e9',
          DEFAULT: '#75e0e4',
          dark: '#5cbabf',
          // DEFAULT: '#B5A642',
          // light: '#C6B855',
          // dark: '#8C7F32',
        },
      },
    },
  },
  plugins: [],
}

export default config