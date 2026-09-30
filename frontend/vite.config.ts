/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

/**
 * Same-origin by design: the browser always calls relative `/api/...` paths.
 * In development Vite proxies them; in production Agent 1's `nginx.conf` proxies them.
 * Nothing in `src/` ever names a host, which is what keeps the app working behind the
 * Arena preview proxy, inside Docker, and under HTTPS without mixed-content errors.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // `backend` is the docker-compose service name used by Agent 1's nginx.conf.
  const apiTarget = env.VITE_DEV_API_TARGET || 'http://backend:8000';

  return {
    plugins: [
      react(),
      VitePWA({
        // `prompt`, not `autoUpdate`: a forced reload mid-quiz would discard answers.
        registerType: 'prompt',
        includeAssets: ['favicon.svg'],
        manifest: {
          name: 'HAAFIZ EDU',
          short_name: 'HAAFIZ',
          description: 'Pakistan-first personalized learning system',
          theme_color: '#5b4be8',
          background_color: '#f6f5f0',
          display: 'standalone',
          start_url: '/',
          lang: 'en',
          icons: [
            { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          ],
        },
        workbox: {
          navigateFallback: '/index.html',
          globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
          // Architecture decision #6 on Agent 1's branch: cache the application shell only.
          // Runtime-caching `/api/**` would persist one student's private mastery data in a
          // shared browser profile. `navigateFallbackDenylist` keeps API URLs off the SW path.
          navigateFallbackDenylist: [/^\/api\//],
          runtimeCaching: [],
        },
        devOptions: { enabled: false },
      }),
    ],
    server: {
      host: '0.0.0.0',
      port: 3000,
      // The Arena live preview is served from https://{port}-{sandbox}.e2b.app, so the dev
      // server must accept that Host header or Vite 6 answers with "Blocked request".
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
      proxy: {
        '/api': { target: apiTarget, changeOrigin: true, ws: true },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 3000,
      allowedHosts: ['.e2b.app', 'localhost', '127.0.0.1'],
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/test/setup.ts'],
      css: false,
      include: ['src/**/*.{test,spec}.{ts,tsx}', '../tests/frontend/**/*.{test,spec}.{ts,tsx}'],
      coverage: {
        provider: 'v8',
        reporter: ['text', 'json-summary', 'html'],
        reportsDirectory: './coverage',
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/main.tsx',
          'src/test/**',
          'src/**/*.d.ts',
          'src/**/index.ts',
          'src/i18n/locales/**',
        ],
      },
    },
  };
});
