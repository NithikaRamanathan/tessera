import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'prop-types': 'prop-types/prop-types',
    },
  },
  optimizeDeps: {
    include: ['prop-types'],
  },
})