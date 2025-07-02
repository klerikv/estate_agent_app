import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()], //плагин для React
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', //адрес бэкенд-сервера
        changeOrigin: true, 
      },
    },
    port: 3000, //React-приложение (фронтенд) будет запускаться на порту 3000
  },
});
