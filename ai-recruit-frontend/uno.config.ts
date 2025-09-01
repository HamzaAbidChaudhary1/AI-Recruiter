import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  shortcuts: [
    // Button styles
    ['btn', 'px-4 py-2 rounded-lg inline-block cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200'],
    ['btn-primary', 'btn bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800'],
    ['btn-secondary', 'btn bg-gray-600 text-white hover:bg-gray-700 active:bg-gray-800'],
    ['btn-success', 'btn bg-green-600 text-white hover:bg-green-700 active:bg-green-800'],
    ['btn-danger', 'btn bg-red-600 text-white hover:bg-red-700 active:bg-red-800'],
    ['btn-outline', 'btn border-2 border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800'],
    
    // Card styles
    ['card', 'rounded-xl bg-white dark:bg-gray-800 shadow-lg p-6'],
    ['card-hover', 'card hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300'],
    ['card-gradient', 'card bg-gradient-to-br from-indigo-500 to-purple-600 text-white'],
    
    // Form styles
    ['input-base', 'w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all'],
    ['input-error', 'input-base border-red-500 focus:ring-red-500'],
    ['input-success', 'input-base border-green-500 focus:ring-green-500'],
    ['label-base', 'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'],
    
    // Badge styles
    ['badge', 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'],
    ['badge-primary', 'badge bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400'],
    ['badge-success', 'badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'],
    ['badge-warning', 'badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'],
    ['badge-danger', 'badge bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'],
    
    // Layout styles
    ['container-base', 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'],
    ['section-base', 'py-8 sm:py-12 lg:py-16'],
    ['flex-center', 'flex items-center justify-center'],
    ['flex-between', 'flex items-center justify-between'],
    
    // Animation styles
    ['animate-fade-in', 'animate-fade-in animate-duration-500 animate-ease-out'],
    ['animate-slide-up', 'animate-slide-in-up animate-duration-500 animate-ease-out'],
    ['animate-slide-down', 'animate-slide-in-down animate-duration-500 animate-ease-out'],
    ['animate-scale', 'animate-zoom-in animate-duration-300 animate-ease-out'],
    
    // Glass morphism
    ['glass', 'backdrop-blur-lg bg-white/10 border border-white/20'],
    ['glass-dark', 'backdrop-blur-lg bg-black/20 border border-white/10'],
    
    // Text styles
    ['text-gradient', 'bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent'],
    ['heading-1', 'text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white'],
    ['heading-2', 'text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'],
    ['heading-3', 'text-2xl sm:text-3xl font-semibold text-gray-900 dark:text-white'],
    ['text-muted', 'text-gray-600 dark:text-gray-400'],
    
    // Status indicators
    ['status-online', 'w-3 h-3 bg-green-500 rounded-full animate-pulse'],
    ['status-offline', 'w-3 h-3 bg-gray-400 rounded-full'],
    ['status-busy', 'w-3 h-3 bg-red-500 rounded-full animate-pulse'],
    ['status-away', 'w-3 h-3 bg-yellow-500 rounded-full'],
  ],
  
  theme: {
    colors: {
      // Custom brand colors
      'brand': {
        50: '#f0f4ff',
        100: '#e0e9ff',
        200: '#c7d6ff',
        300: '#a4b8ff',
        400: '#7b91ff',
        500: '#5465ff',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
      }
    },
    
    animation: {
      keyframes: {
        'fade-in': '{from{opacity:0}to{opacity:1}}',
        'fade-out': '{from{opacity:1}to{opacity:0}}',
        'slide-in-up': '{from{transform:translateY(100%)}to{transform:translateY(0)}}',
        'slide-in-down': '{from{transform:translateY(-100%)}to{transform:translateY(0)}}',
        'slide-in-left': '{from{transform:translateX(-100%)}to{transform:translateX(0)}}',
        'slide-in-right': '{from{transform:translateX(100%)}to{transform:translateX(0)}}',
        'zoom-in': '{from{transform:scale(0)}to{transform:scale(1)}}',
        'zoom-out': '{from{transform:scale(1)}to{transform:scale(0)}}',
        'spin-slow': '{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}',
        'bounce-slow': '{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}',
        'shimmer': '{0%{background-position:200% 0}100%{background-position:-200% 0}}',
        'pulse-scale': '{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}',
        'wiggle': '{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}',
      },
      durations: {
        'spin-slow': '3s',
        'bounce-slow': '2s',
        'shimmer': '3s',
        'pulse-scale': '2s',
        'wiggle': '1s',
      },
      timingFns: {
        'bounce-slow': 'cubic-bezier(0.4, 0, 0.6, 1)',
        'shimmer': 'linear',
      },
      counts: {
        'spin-slow': 'infinite',
        'bounce-slow': 'infinite',
        'shimmer': 'infinite',
        'pulse-scale': 'infinite',
        'wiggle': 'infinite',
      }
    },
    
    breakpoints: {
      'xs': '480px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '1920px',
    }
  },
  
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      collections: {
        'heroicons': () => import('@iconify-json/heroicons/icons.json').then(i => i.default),
        'tabler': () => import('@iconify-json/tabler/icons.json').then(i => i.default),
        'mdi': () => import('@iconify-json/mdi/icons.json').then(i => i.default),
        'carbon': () => import('@iconify-json/carbon/icons.json').then(i => i.default),
      }
    }),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Inter:400,500,600,700,800,900',
        mono: 'JetBrains Mono:400,500,600,700',
        display: 'Lexend:400,500,600,700,800,900',
      },
    }),
  ],
  
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  
  safelist: [
    // Dynamic class patterns that might be generated at runtime
    ...['indigo', 'green', 'blue', 'purple', 'red', 'yellow', 'gray'].map(
      color => [`bg-${color}-500`, `text-${color}-500`, `border-${color}-500`]
    ).flat(),
    // Icon sizes
    'i-heroicons-check',
    'i-heroicons-x-mark',
    'i-heroicons-exclamation-triangle',
    'i-heroicons-information-circle',
  ],
  
  rules: [
    // Custom rules for special effects
    ['glow', { 'box-shadow': '0 0 20px rgba(99, 102, 241, 0.5)' }],
    ['glow-lg', { 'box-shadow': '0 0 40px rgba(99, 102, 241, 0.7)' }],
    ['text-shadow', { 'text-shadow': '0 1px 3px rgba(0, 0, 0, 0.1)' }],
    ['text-shadow-lg', { 'text-shadow': '0 2px 10px rgba(0, 0, 0, 0.2)' }],
    
    // Gradient text
    [/^text-gradient-(.+)-(.+)$/, ([, from, to]) => ({
      'background': `linear-gradient(to right, var(--un-color-${from}-500), var(--un-color-${to}-500))`,
      '-webkit-background-clip': 'text',
      '-webkit-text-fill-color': 'transparent',
      'background-clip': 'text',
    })],
    
    // Aspect ratios
    [/^aspect-(\d+)\/(\d+)$/, ([, w, h]) => ({
      'aspect-ratio': `${w}/${h}`,
    })],
    
    // Custom animations
    ['animate-float', {
      animation: 'float 6s ease-in-out infinite',
      '@keyframes float': {
        '0%, 100%': { transform: 'translateY(0)' },
        '50%': { transform: 'translateY(-20px)' },
      },
    }],
    
    // Scrollbar styles
    ['scrollbar-thin', {
      'scrollbar-width': 'thin',
      '&::-webkit-scrollbar': {
        width: '8px',
        height: '8px',
      },
    }],
    ['scrollbar-hide', {
      'scrollbar-width': 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
    }],
  ],
  
  variants: [
    // Custom hover group variant
    (matcher) => {
      if (!matcher.startsWith('hover-group:'))
        return matcher
      return {
        matcher: matcher.slice(12),
        selector: s => `.group:hover ${s}`,
      }
    },
    
    // Custom peer variant for sibling selectors
    (matcher) => {
      if (!matcher.startsWith('peer-checked:'))
        return matcher
      return {
        matcher: matcher.slice(13),
        selector: s => `.peer:checked ~ ${s}`,
      }
    },
  ],
  
  // Extract classes from additional file types
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|mdx?|astro|elm|php|phtml|html)($|\?)/,
        'apps/**/*.{js,ts,vue}',
        'packages/**/*.{js,ts,vue}',
      ],
    },
  },
})
