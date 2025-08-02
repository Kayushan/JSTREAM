import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173, // Default Vite port
    strictPort: true, // Fail if port is already in use
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app', // Allow all ngrok subdomains
      '.ngrok.io', // Allow legacy ngrok domains
      '.ngrok.app', // Allow new ngrok domains
    ],
    cors: true, // Enable CORS
    hmr: {
      host: 'localhost', // HMR host for development
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 4173,
    strictPort: true,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '.ngrok-free.app',
      '.ngrok.io',
      '.ngrok.app',
    ],
  },
})
