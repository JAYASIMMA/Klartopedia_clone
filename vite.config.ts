import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,           // Change if needed
    open: true            // Auto-open browser
  },
  build: {
    outDir: 'dist',       // Output folder
    sourcemap: true       // Optional: easier debugging
  },
  resolve: {
    alias: {
      '@': '/src',        // Allow imports like "@/components/Button"
    }
  }
})
