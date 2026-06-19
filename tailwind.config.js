/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      '2md': '800px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        gray: {
          text: '#a1a1aa', // zinc-400
        },
        neutral: {
          primary: '#09090b', // zinc-950
        },
      },
      fontFamily: {
        sans: ['"Geist Sans"', 'system-ui', 'sans-serif'],
        mono: ['"Geist Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
