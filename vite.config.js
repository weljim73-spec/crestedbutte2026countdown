import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? '/dataapps/arr-plan-2026',
  server: {
    port: 8080,
    host: true,
  },
})
