import { ref, onMounted, onUnmounted } from 'vue'
import { useEventListener, useFullscreen, useDocumentVisibility } from '@vueuse/core'

export interface ExamModeOptions {
  preventRightClick?: boolean
  preventTextSelection?: boolean
  preventDevTools?: boolean
  preventPrint?: boolean
  preventScreenshot?: boolean
  enforceFullscreen?: boolean
  detectTabSwitch?: boolean
  detectWindowBlur?: boolean
  maxTabSwitches?: number
  idleTimeout?: number // in seconds
  onViolation?: (type: ViolationType) => void
  onIdleTimeout?: () => void
}

export type ViolationType = 
  | 'right-click'
  | 'text-selection'
  | 'dev-tools'
  | 'print'
  | 'screenshot'
  | 'fullscreen-exit'
  | 'tab-switch'
  | 'window-blur'
  | 'copy-paste'
  | 'key-combination'

export function useExamMode(options: ExamModeOptions = {}) {
  const {
    preventRightClick = true,
    preventTextSelection = true,
    preventDevTools = true,
    preventPrint = true,
    preventScreenshot = true,
    enforceFullscreen = true,
    detectTabSwitch = true,
    detectWindowBlur = true,
    maxTabSwitches = 3,
    idleTimeout = 300,
    onViolation = () => {},
    onIdleTimeout = () => {}
  } = options

  const isActive = ref(false)
  const violations = ref<ViolationType[]>([])
  const tabSwitchCount = ref(0)
  const lastActivity = ref(Date.now())
  const isFullscreen = ref(false)
  
  const { isFullscreen: fullscreenState, enter: enterFullscreen, exit: exitFullscreen } = useFullscreen()
  const visibility = useDocumentVisibility()
  
  let devToolsChecker: NodeJS.Timeout | null = null
  let idleChecker: NodeJS.Timeout | null = null

  // Prevent right-click context menu
  const handleContextMenu = (e: MouseEvent) => {
    if (preventRightClick && isActive.value) {
      e.preventDefault()
      violations.value.push('right-click')
      onViolation('right-click')
      return false
    }
  }

  // Prevent text selection
  const handleSelectStart = (e: Event) => {
    if (preventTextSelection && isActive.value) {
      e.preventDefault()
      violations.value.push('text-selection')
      onViolation('text-selection')
      return false
    }
  }

  // Prevent copy/cut/paste
  const handleCopyPaste = (e: ClipboardEvent) => {
    if (isActive.value) {
      e.preventDefault()
      violations.value.push('copy-paste')
      onViolation('copy-paste')
      return false
    }
  }

  // Detect DevTools
  const checkDevTools = () => {
    if (!preventDevTools || !isActive.value) return

    const threshold = 160
    const widthThreshold = window.outerWidth - window.innerWidth > threshold
    const heightThreshold = window.outerHeight - window.innerHeight > threshold
    
    if (widthThreshold || heightThreshold) {
      violations.value.push('dev-tools')
      onViolation('dev-tools')
    }

    // Also check for console.log timing
    const start = performance.now()
    console.log('%c', 'font-size: 1px')
    const end = performance.now()
    
    if (end - start > 100) {
      violations.value.push('dev-tools')
      onViolation('dev-tools')
    }
  }

  // Prevent keyboard shortcuts
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!isActive.value) return

    const blocked = [
      // DevTools
      { ctrl: true, shift: true, key: 'I' },
      { ctrl: true, shift: true, key: 'J' },
      { ctrl: true, shift: true, key: 'C' },
      { key: 'F12' },
      // Print
      { ctrl: true, key: 'P' },
      // Save
      { ctrl: true, key: 'S' },
      // Screenshot (Windows)
      { key: 'PrintScreen' },
      // Refresh
      { key: 'F5' },
      { ctrl: true, key: 'R' },
      // Find
      { ctrl: true, key: 'F' },
      // View source
      { ctrl: true, key: 'U' }
    ]

    const isBlocked = blocked.some(combo => {
      if (combo.ctrl && !e.ctrlKey && !e.metaKey) return false
      if (combo.shift && !e.shiftKey) return false
      if (combo.key && e.key !== combo.key) return false
      return true
    })

    if (isBlocked) {
      e.preventDefault()
      e.stopPropagation()
      violations.value.push('key-combination')
      onViolation('key-combination')
      return false
    }
  }

  // Detect tab switching
  const handleVisibilityChange = () => {
    if (!detectTabSwitch || !isActive.value) return

    if (visibility.value === 'hidden') {
      tabSwitchCount.value++
      violations.value.push('tab-switch')
      onViolation('tab-switch')

      if (tabSwitchCount.value >= maxTabSwitches) {
        console.warn(`Maximum tab switches (${maxTabSwitches}) exceeded`)
      }
    }
  }

  // Detect window blur
  const handleWindowBlur = () => {
    if (!detectWindowBlur || !isActive.value) return
    
    violations.value.push('window-blur')
    onViolation('window-blur')
  }

  // Monitor fullscreen
  const handleFullscreenChange = () => {
    if (!enforceFullscreen || !isActive.value) return

    if (!document.fullscreenElement) {
      violations.value.push('fullscreen-exit')
      onViolation('fullscreen-exit')
      
      // Try to re-enter fullscreen
      setTimeout(() => {
        if (isActive.value && enforceFullscreen) {
          enterFullscreen()
        }
      }, 100)
    }
  }

  // Check for idle timeout
  const resetIdleTimer = () => {
    lastActivity.value = Date.now()
  }

  const checkIdleTimeout = () => {
    if (!isActive.value || !idleTimeout) return

    const idleTime = (Date.now() - lastActivity.value) / 1000
    if (idleTime > idleTimeout) {
      onIdleTimeout()
    }
  }

  // Start exam mode
  const start = async () => {
    isActive.value = true
    violations.value = []
    tabSwitchCount.value = 0
    lastActivity.value = Date.now()

    // Enter fullscreen if required
    if (enforceFullscreen) {
      await enterFullscreen()
    }

    // Add CSS to prevent selection
    if (preventTextSelection) {
      document.body.style.userSelect = 'none'
      document.body.style.webkitUserSelect = 'none'
    }

    // Start DevTools checker
    if (preventDevTools) {
      devToolsChecker = setInterval(checkDevTools, 1000)
    }

    // Start idle checker
    if (idleTimeout) {
      idleChecker = setInterval(checkIdleTimeout, 5000)
    }

    // Disable browser features via CSS
    const style = document.createElement('style')
    style.id = 'exam-mode-styles'
    style.innerHTML = `
      body.exam-mode {
        -webkit-touch-callout: none !important;
        -webkit-user-select: none !important;
        -khtml-user-select: none !important;
        -moz-user-select: none !important;
        -ms-user-select: none !important;
        user-select: none !important;
      }
      body.exam-mode img {
        pointer-events: none !important;
      }
      @media print {
        body.exam-mode * {
          display: none !important;
        }
      }
    `
    document.head.appendChild(style)
    document.body.classList.add('exam-mode')
  }

  // Stop exam mode
  const stop = () => {
    isActive.value = false

    // Exit fullscreen
    if (document.fullscreenElement) {
      exitFullscreen()
    }

    // Remove CSS restrictions
    document.body.style.userSelect = ''
    document.body.style.webkitUserSelect = ''
    document.body.classList.remove('exam-mode')
    
    const style = document.getElementById('exam-mode-styles')
    if (style) {
      style.remove()
    }

    // Clear intervals
    if (devToolsChecker) {
      clearInterval(devToolsChecker)
      devToolsChecker = null
    }
    if (idleChecker) {
      clearInterval(idleChecker)
      idleChecker = null
    }
  }

  // Setup event listeners
  onMounted(() => {
    // Context menu
    useEventListener(document, 'contextmenu', handleContextMenu)
    
    // Selection
    useEventListener(document, 'selectstart', handleSelectStart)
    
    // Copy/paste
    useEventListener(document, 'copy', handleCopyPaste)
    useEventListener(document, 'cut', handleCopyPaste)
    useEventListener(document, 'paste', handleCopyPaste)
    
    // Keyboard
    useEventListener(document, 'keydown', handleKeyDown)
    
    // Visibility
    useEventListener(document, 'visibilitychange', handleVisibilityChange)
    
    // Window blur
    useEventListener(window, 'blur', handleWindowBlur)
    
    // Fullscreen
    useEventListener(document, 'fullscreenchange', handleFullscreenChange)
    
    // Activity tracking
    useEventListener(document, 'mousemove', resetIdleTimer)
    useEventListener(document, 'keypress', resetIdleTimer)
    useEventListener(document, 'click', resetIdleTimer)
    useEventListener(document, 'scroll', resetIdleTimer)
  })

  onUnmounted(() => {
    stop()
  })

  return {
    isActive: readonly(isActive),
    violations: readonly(violations),
    tabSwitchCount: readonly(tabSwitchCount),
    isFullscreen: fullscreenState,
    start,
    stop,
    resetViolations: () => {
      violations.value = []
      tabSwitchCount.value = 0
    }
  }
}
