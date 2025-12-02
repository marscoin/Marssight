import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4005',
        changeOrigin: true,
      },
      '/socket.io': {
        target: 'http://localhost:4005',
        changeOrigin: true,
        ws: true,
      },
      '/price-api': {
        target: 'https://price.marscoin.org',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/price-api/, ''),
        secure: false,
      },
    },
  },
})
