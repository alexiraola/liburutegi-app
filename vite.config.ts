/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    // Minimal config for integration tests
    globals: true,
    environment: 'node', // Use node environment for real API calls
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    testTimeout: 10000, // 10s timeout for API calls
  },
})
