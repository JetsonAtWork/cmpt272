import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from 'tailwindcss'
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      // eslint-disable-next-line no-undef
      '@': path.resolve(__dirname, 'src'), // This lets you prefix absolute imports starting from src/ with @
    },
  },
  server: {
    host: '127.0.0.1',
    port: '5173'
  },
  css: {
    postcss: {
      plugins: [tailwindcss()]
    }
  },
  plugins: [
    react(),
    // tailwindcss()
  ],
})
