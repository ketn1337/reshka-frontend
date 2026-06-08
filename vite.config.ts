import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Проксируем /api и /photos на Go-бэкенд, чтобы запросы шли same-origin
      // и не дёргали CORS preflight.
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
      '/photos': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
