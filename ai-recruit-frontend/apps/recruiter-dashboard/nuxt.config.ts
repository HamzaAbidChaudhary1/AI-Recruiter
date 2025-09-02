export default defineNuxtConfig({
  devtools: { enabled: false },
  
  ssr: false, // SPA mode for Netlify
  
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
    'nuxt-icon'
  ],

  css: [
    '@unocss/reset/tailwind.css'
  ],

  imports: {
    dirs: ['stores', 'composables/**']
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'https://jsonplaceholder.typicode.com',
      wsUrl: process.env.NUXT_PUBLIC_WS_URL || 'wss://echo.websocket.org',
      webrtcUrl: process.env.NUXT_PUBLIC_WEBRTC_URL || 'https://jsonplaceholder.typicode.com'
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

  vite: {
    optimizeDeps: {
      include: [
        'echarts/core',
        'echarts/charts', 
        'echarts/components',
        'echarts/renderers',
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
      routes: ['/dashboard', '/']
    }
  },

  experimental: {
    payloadExtraction: false,
    renderJsonPayloads: true
  }
})
