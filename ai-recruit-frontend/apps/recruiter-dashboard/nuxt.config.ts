export default defineNuxtConfig({
  devtools: { enabled: true },
  
  ssr: true,
  
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
      webrtcUrl: process.env.NUXT_PUBLIC_WEBRTC_URL || 'http://localhost:4002'
    }
  },

  pinia: {
    autoImports: ['defineStore', 'storeToRefs']
  },

  colorMode: {
    preference: 'system',
    fallback: 'light',
    classSuffix: ''
  },

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'AI Recruit - Recruiter Dashboard',
      short_name: 'AI Recruit',
      theme_color: '#4F46E5',
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
      navigateFallback: '/',
      globPatterns: ['**/*.{js,css,html,png,svg,ico}']
    },
    client: {
      installPrompt: true
    }
  },

  vite: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts',
        'echarts/components',
        'echarts/renderers',
        'three',
        'd3',
        'gsap',
        'lottie-web',
        'socket.io-client'
      ]
    }
  },

  nitro: {
    compressPublicAssets: true,
    prerender: {
      routes: ['/']
    }
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true,
    typedPages: true
  }
})
