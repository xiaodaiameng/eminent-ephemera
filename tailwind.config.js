/** @type {import('tailwindcss').Config} */  
import daisyui from 'daisyui';  

export default {  
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  
  plugins: [daisyui],
  
  daisyui: {  
    themes: ["light", "dark"],
    darkTheme: "dark",  
    base: true,  
    styled: true,  
    utils: true,  
  },
}