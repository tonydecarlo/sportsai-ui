import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001', // Changed from 5000 to avoid macOS AirPlay conflict
        changeOrigin: true
      }
    }
  }
})


