<template>
  <NuxtLayout>
    <NuxtLoadingIndicator :height="3" :duration="2000" color="#4F46E5" />
    <NuxtPage />
    <UNotifications />
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useHead } from '@unhead/vue'
import { useColorMode } from '@vueuse/core'

// SEO Configuration
useHead({
  title: 'AI Recruit - Recruiter Dashboard',
  meta: [
    { name: 'description', content: 'AI-powered recruitment platform for modern hiring' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// Initialize color mode
const colorMode = useColorMode()

// Initialize real-time connection
onMounted(() => {
  const { initializeSocket } = useRealtimeConnection()
  initializeSocket()
})

// Clean up on unmount
onUnmounted(() => {
  const { disconnect } = useRealtimeConnection()
  disconnect()
})
</script>

<style>
html {
  scroll-behavior: smooth;
}

body {
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
</style>
