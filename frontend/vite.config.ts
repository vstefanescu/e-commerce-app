import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // ← adaugă importul ăsta

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // ← Asta e esențial!
    },
  },
});
