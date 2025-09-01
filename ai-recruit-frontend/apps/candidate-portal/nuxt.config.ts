export default defineNuxtConfig({
  devtools: { enabled: true },
  
  ssr: false, // SPA mode for better client-side control
  
  typescript: {
    strict: true,
    shim: false
  },

  modules: [
    '@nuxt/ui',
    '@unocss/nuxt',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    '@nuxtjs/color-mode',
    'nuxt-icon',
    '@vite-pwa/nuxt'
  ],

  css: [
    '@unocss/reset/tailwind.css',
    '~/assets/css/main.css'
  ],

  imports: {
    dirs: ['stores', 'composables/**']
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:4000',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || 'ws://localhost:4001',
      webrtcUrl: process.env.NUXT_PUBLIC_WEBRTC_URL || 'http://localhost:4002',
      maxRecordingDuration: 300, // 5 minutes max per question
      idleTimeout: 300, // 5 minutes idle timeout
      tabSwitchLimit: 3, // Max allowed tab switches
      webcamRequired: true,
      screenShareRequired: false
    }
  },

  pinia: {
    autoImports: ['defineStore', 'storeToRefs']
  },

  colorMode: {
    preference: 'light',
    fallback: 'light',
    classSuffix: '',
    storageKey: 'candidate-color-mode'
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'AI Recruit - Assessment Portal',
      short_name: 'AI Assessment',
      theme_color: '#10B981',
      background_color: '#ffffff',
      display: 'fullscreen',
      orientation: 'landscape',
      icons: [
        {
          src: 'icon-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'icon-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: null,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/api\./,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'api-cache',
            networkTimeoutSeconds: 10
          }
        }
      ]
    },
    client: {
      installPrompt: false,
      periodicSyncForUpdates: 3600
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        'gsap',
        'lottie-web',
        'socket.io-client',
        'recordrtc',
        'wavesurfer.js'
      ]
    },
    worker: {
      format: 'es'
    }
  },

  nitro: {
    compressPublicAssets: true
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true,
    viewTransition: true
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  }
})
