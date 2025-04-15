import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No Tailwind plugin needed here!
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
  },
})
