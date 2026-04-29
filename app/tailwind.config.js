/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        body: ['IBM Plex Sans', 'ui-sans-serif', 'sans-serif'],
        heading: ['Space Grotesk', 'ui-sans-serif', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

