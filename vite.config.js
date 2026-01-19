import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set base to './' so assets are loaded relatively.
  // This helps when deploying to a non-root path like username.github.io/repo-name/
  base: './'
})
