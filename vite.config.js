import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // base: '/ecommerce_app/ecommerce-backend/',   //  ← exact URL folder!
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          mui:   ['@mui/material', '@mui/icons-material']
        }
      }
    }
  }
})
