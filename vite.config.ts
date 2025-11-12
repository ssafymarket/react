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
  define: {
    global: 'globalThis',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://k13d201.p.ssafy.io:8084',
        changeOrigin: true,
        secure: false,
      },
      '/ws': {
        target: 'http://k13d201.p.ssafy.io:8084',
        changeOrigin: true,
        secure: false,
        ws: true, // WebSocket 프록시 활성화
      },
    },
  },
})
