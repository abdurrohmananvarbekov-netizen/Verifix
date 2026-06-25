import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api-proxy': {
        target: 'https://app.verifix.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-proxy/, '')
      },
      '/oauth-token': {
        target: 'https://app.verifix.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oauth-token/, '/security/oauth/token')
      }
    }
  }
})

