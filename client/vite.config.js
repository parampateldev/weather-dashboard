import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project Pages URL: https://parampateldev.github.io/weather-dashboard/
export default defineConfig({
  plugins: [react()],
  base: '/weather-dashboard/',
})
