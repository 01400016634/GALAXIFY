import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: '3d-universe/public',
  optimizeDeps: {
    include: ['pdfjs-dist'],
    esbuildOptions: {
      target: 'esnext',
    },
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 2000, // 🚀 This silences the 500kb warning!
  },
})