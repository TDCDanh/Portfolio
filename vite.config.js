import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'

export default defineConfig({
  // Repository GitHub Pages is served from https://tdcdanh.github.io/Portfolio/.
  base: '/Portfolio/',
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
  build: {
    // Publish both the main portfolio and the standalone local-AI chat page.
    rolldownOptions: {
      input: {
        portfolio: resolve(import.meta.dirname, 'index.html'),
        aiChat: resolve(import.meta.dirname, 'AIdemo.html'),
      },
    },
  },
})
