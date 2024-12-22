/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
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
