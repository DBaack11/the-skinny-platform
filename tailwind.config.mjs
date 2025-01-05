/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      'lie': ['Lie To Me', 'cursive'],
    },
    extend: {
      colors: {
        "skinny-blue": "#6A8CAF",
        "skinny-orange": "#FFA500",
        "skinny-cream": "#FFF6E5",
      },
    },
  },
  plugins: [],
};
