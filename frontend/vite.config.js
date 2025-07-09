import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/bedasolar/' : '/',
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:3001',
      '/auth': 'http://localhost:3001'
    }
  }
}) 