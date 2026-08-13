import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/portfolio/',
  plugins: [react(), tailwindcss()],
  build: {
    // three.js lazy chunk (~724 kB) is intentionally large; already code-split
    chunkSizeWarningLimit: 750,
  },
})
