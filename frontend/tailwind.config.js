/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        foreground: '#020618',
        mutedForeground: '#62748E',
        input: '#E2E8F0',
        primary: '#155DFC',
        accentForeground: '#0F172B',
      },
    },
  },
  plugins: [],
};
