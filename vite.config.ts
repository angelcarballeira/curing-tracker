import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      // "autoUpdate": when you deploy a new version, the service worker
      // installs it in the background and the next page load uses it.
      registerType: 'autoUpdate',
      // Files from /public that are not in the manifest but must work offline.
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Control de Curado',
        short_name: 'Curado',
        description: 'Controlá el curado y secado de bondiolas, lomitos y más.',
        lang: 'es',
        // "standalone" removes the browser address bar, so it feels like an app.
        display: 'standalone',
        start_url: '/',
        theme_color: '#059669', // colors the phone's status bar
        background_color: '#1c1917', // splash screen while the app opens
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          {
            // "maskable" lets Android crop the icon into its own shape.
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})