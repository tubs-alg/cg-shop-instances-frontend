import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
  base: '/instances/',
  plugins: [
    vue(),
    vuetify({autoImport: true}),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    // The backend only allows CORS requests from this port.
    port: 8080
  },
  optimizeDeps: {
    // Pre-bundle the overlay components together, otherwise overlays inside
    // dialogs can end up behind them in dev mode (see Vuetify 4 upgrade guide).
    include: [
      'vuetify/components/VOverlay',
      'vuetify/components/VDialog',
      'vuetify/components/VMenu',
      'vuetify/components/VSelect',
      'vuetify/components/VTooltip',
    ]
  }
})
