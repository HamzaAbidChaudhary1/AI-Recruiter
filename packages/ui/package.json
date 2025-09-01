<template>
  <div
    ref="cardRef"
    :class="[
      'animated-card relative overflow-hidden rounded-xl transition-all duration-300',
      variant === 'elevated' && 'shadow-lg hover:shadow-2xl',
      variant === 'outlined' && 'border border-gray-200 dark:border-gray-700',
      variant === 'gradient' && 'bg-gradient-to-br',
      interactive && 'cursor-pointer transform hover:scale-[1.02]',
      className
    ]"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click="handleClick"
  >
    <!-- Gradient Background -->
    <div
      v-if="variant === 'gradient'"
      class="absolute inset-0 bg-gradient-to-br opacity-90"
      :class="gradientClasses"
    />
    
    <!-- Hover Overlay -->
    <div
      v-if="interactive"
      ref="overlayRef"
      class="absolute inset-0 opacity-0 bg-gradient-to-t from-black/5 to-transparent pointer-events-none"
    />
    
    <!-- Shimmer Effect -->
    <div
      v-if="shimmer"
      ref="shimmerRef"
      class="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
    />
    
    <!-- Content -->
    <div class="relative z-10" :class="contentClass">
      <slot />
    </div>
    
    <!-- Corner Badge -->
    <div
      v-if="$slots.badge"
      class="absolute top-2 right-2 z-20"
    >
      <slot name="badge" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

interface Props {
  variant?: 'elevated' | 'outlined' | 'gradient' | 'glass'
  interactive?: boolean
  shimmer?: boolean
  gradientFrom?: string
  gradientTo?: string
  className?: string
  contentClass?: string
  animateOnScroll?: boolean
  stagger?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'elevated',
  interactive: false,
  shimmer: false,
  gradientFrom: 'from-indigo-500',
  gradientTo: 'to-purple-600',
  className: '',
  contentClass: 'p-6',
  animateOnScroll: false,
  stagger: 0
})

const emit = defineEmits<{
  click: [event: MouseEvent]
  mouseenter: []
  mouseleave: []
}>()

const cardRef = ref<HTMLElement>()
const overlayRef = ref<HTMLElement>()
const shimmerRef = ref<HTMLElement>()

const gradientClasses = computed(() => {
  if (props.variant === 'gradient') {
    return `${props.gradientFrom} ${props.gradientTo}`
  }
  return ''
})

let shimmerAnimation: gsap.core.Timeline | null = null
let scrollTrigger: any = null

const handleMouseEnter = () => {
  if (!props.interactive) return
  
  if (overlayRef.value) {
    gsap.to(overlayRef.value, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  
  emit('mouseenter')
}

const handleMouseLeave = () => {
  if (!props.interactive) return
  
  if (overlayRef.value) {
    gsap.to(overlayRef.value, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  
  emit('mouseleave')
}

const handleClick = (event: MouseEvent) => {
  if (!props.interactive) return
  
  // Ripple effect
  const ripple = document.createElement('div')
  ripple.className = 'absolute bg-white/30 rounded-full pointer-events-none'
  ripple.style.width = '20px'
  ripple.style.height = '20px'
  
  const rect = cardRef.value!.getBoundingClientRect()
  ripple.style.left = `${event.clientX - rect.left - 10}px`
  ripple.style.top = `${event.clientY - rect.top - 10}px`
  
  cardRef.value!.appendChild(ripple)
  
  gsap.to(ripple, {
    width: '400px',
    height: '400px',
    x: '-190px',
    y: '-190px',
    opacity: 0,
    duration: 0.6,
    ease: 'power2.out',
    onComplete: () => ripple.remove()
  })
  
  emit('click', event)
}

const initializeAnimations = () => {
  // Shimmer animation
  if (props.shimmer && shimmerRef.value) {
    shimmerAnimation = gsap.timeline({ repeat: -1, repeatDelay: 3 })
    shimmerAnimation.to(shimmerRef.value, {
      x: '200%',
      duration: 1.5,
      ease: 'power2.inOut'
    })
  }
  
  // Scroll animation
  if (props.animateOnScroll && cardRef.value) {
    gsap.set(cardRef.value, {
      opacity: 0,
      y: 50
    })
    
    // ScrollTrigger would be imported separately in production
    gsap.to(cardRef.value, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      delay: props.stagger,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardRef.value,
        start: 'top 80%',
        toggleActions: 'play none none reverse'
      }
    })
  }
}

onMounted(() => {
  initializeAnimations()
})

onUnmounted(() => {
  shimmerAnimation?.kill()
  if (scrollTrigger) {
    scrollTrigger.kill()
  }
})
</script>

<style scoped>
.animated-card {
  backface-visibility: hidden;
  transform: translateZ(0);
  will-change: transform;
}

.animated-card.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.dark .animated-card.glass {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
