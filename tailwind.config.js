import daisyui from 'daisyui'
/** @type {import('tailwindcss').Config} */
export default {
  daisyui: {
    themes: [
      {
        default: {
          // This is where we modify the styling of the components. reference: https://daisyui.com/theme-generator/
          "primary": "#111827",
          "secondary": "#374151",
          "accent": "#4b5563",
          "neutral": "#ffffff",
          "base-100": "#ffffff",
          "info": "#ffffff",
          "success": "#86efac",
          "warning": "#fcd34d",
          "error": "#f87171",
        }
      },
      "night"
    ],
    safelist: ['fill-primary']
  },

  safelist: ['fill-primary'],
  content: ["./src/**/*.{js,ts,jsx,tsx}","./index.html"],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
}

