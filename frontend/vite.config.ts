import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: [],
      manifest: {
        name: 'HAAFIZ EDU',
        short_name: 'HAAFIZ',
        description: 'Pakistan-first personalized learning system',
        theme_color: '#5b4be8',
        background_color: '#f6f5f0',
        display: 'standalone',
        start_url: '/',
        lang: 'en',
      },
      workbox: {
        navigateFallback: '/index.html',
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    port: 3000,
    proxy: { '/api': { target: 'http://backend:8000', changeOrigin: true } },
  },
});
