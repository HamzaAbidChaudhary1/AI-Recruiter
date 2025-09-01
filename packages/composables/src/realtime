import { ref, readonly } from 'vue'
import { io, Socket } from 'socket.io-client'
import type { 
  RealtimeEvent, 
  CandidateUpdateEvent, 
  AssessmentProgressEvent, 
  ProctoringAlertEvent 
} from '@ai-recruit/types'

interface RealtimeOptions {
  url?: string
  autoConnect?: boolean
  reconnection?: boolean
  reconnectionAttempts?: number
  reconnectionDelay?: number
  auth?: Record<string, any>
}

interface ConnectionState {
  isConnected: boolean
  isConnecting: boolean
  error: string | null
  latency: number
  reconnectAttempts: number
}

class RealtimeConnection {
  private socket: Socket | null = null
  private eventHandlers: Map<string, Set<Function>> = new Map()
  private state = ref<ConnectionState>({
    isConnected: false,
    isConnecting: false,
    error: null,
    latency: 0,
    reconnectAttempts: 0
  })
  
  private pingInterval: NodeJS.Timeout | null = null
  private lastPingTime: number = 0

  constructor(private options: RealtimeOptions = {}) {
    if (options.autoConnect) {
      this.connect()
    }
  }

  connect(additionalOptions?: Partial<RealtimeOptions>) {
    if (this.socket?.connected) {
      console.warn('Socket already connected')
      return
    }

    this.state.value.isConnecting = true
    this.state.value.error = null

    const config = useRuntimeConfig()
    const url = additionalOptions?.url || this.options.url || config.public.wsUrl

    this.socket = io(url, {
      reconnection: this.options.reconnection ?? true,
      reconnectionAttempts: this.options.reconnectionAttempts ?? 5,
      reconnectionDelay: this.options.reconnectionDelay ?? 1000,
      auth: additionalOptions?.auth || this.options.auth || {},
      transports: ['websocket', 'polling']
    })

    this.setupEventListeners()
    this.startPingMonitoring()
  }

  private setupEventListeners() {
    if (!this.socket) return

    // Connection events
    this.socket.on('connect', () => {
      this.state.value.isConnected = true
      this.state.value.isConnecting = false
      this.state.value.reconnectAttempts = 0
      console.log('✅ WebSocket connected')
      this.emit('connection:established')
    })

    this.socket.on('disconnect', (reason) => {
      this.state.value.isConnected = false
      console.log('❌ WebSocket disconnected:', reason)
      this.emit('connection:lost', reason)
    })

    this.socket.on('connect_error', (error) => {
      this.state.value.error = error.message
      this.state.value.isConnecting = false
      console.error('WebSocket connection error:', error)
    })

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      this.state.value.reconnectAttempts = attemptNumber
      this.emit('connection:reconnecting', attemptNumber)
    })

    // Ping/Pong for latency monitoring
    this.socket.on('pong', () => {
      const latency = Date.now() - this.lastPingTime
      this.state.value.latency = latency
    })

    // Application events
    this.setupApplicationEvents()
  }

  private setupApplicationEvents() {
    if (!this.socket) return

    // Candidate events
    this.socket.on('candidate:update', (data) => {
      this.handleEvent<CandidateUpdateEvent>({
        type: 'candidate-update',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })

    this.socket.on('candidate:status-change', (data) => {
      this.handleEvent({
        type: 'candidate-status-change',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })

    // Assessment events
    this.socket.on('assessment:progress', (data) => {
      this.handleEvent<AssessmentProgressEvent>({
        type: 'assessment-progress',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })

    this.socket.on('assessment:started', (data) => {
      this.handleEvent({
        type: 'assessment-started',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })

    this.socket.on('assessment:completed', (data) => {
      this.handleEvent({
        type: 'assessment-completed',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })

    // Proctoring events
    this.socket.on('proctoring:alert', (data) => {
      this.handleEvent<ProctoringAlertEvent>({
        type: 'proctoring-alert',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })

    this.socket.on('proctoring:violation', (data) => {
      this.handleEvent({
        type: 'proctoring-violation',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })

    // Analytics events
    this.socket.on('analytics:update', (data) => {
      this.handleEvent({
        type: 'analytics-update',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })

    // System events
    this.socket.on('system:notification', (data) => {
      this.handleEvent({
        type: 'system-notification',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })

    this.socket.on('system:maintenance', (data) => {
      this.handleEvent({
        type: 'system-maintenance',
        payload: data,
        timestamp: new Date().toISOString()
      })
    })
  }

  private handleEvent<T extends RealtimeEvent>(event: T) {
    const handlers = this.eventHandlers.get(event.type)
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(event)
        } catch (error) {
          console.error(`Error handling event ${event.type}:`, error)
        }
      })
    }

    // Also emit a generic event for logging/debugging
    const allHandlers = this.eventHandlers.get('*')
    if (allHandlers) {
      allHandlers.forEach(handler => handler(event))
    }
  }

  private startPingMonitoring() {
    this.pingInterval = setInterval(() => {
      if (this.socket?.connected) {
        this.lastPingTime = Date.now()
        this.socket.emit('ping')
      }
    }, 10000) // Ping every 10 seconds
  }

  private stopPingMonitoring() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }
  }

  // Public methods
  on<T extends RealtimeEvent>(event: string, handler: (data: T) => void) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set())
    }
    this.eventHandlers.get(event)!.add(handler)

    // Return unsubscribe function
    return () => {
      this.off(event, handler)
    }
  }

  off(event: string, handler: Function) {
    const handlers = this.eventHandlers.get(event)
    if (handlers) {
      handlers.delete(handler)
      if (handlers.size === 0) {
        this.eventHandlers.delete(event)
      }
    }
  }

  emit(event: string, data?: any) {
    if (!this.socket?.connected) {
      console.warn('Cannot emit event: Socket not connected')
      return
    }
    this.socket.emit(event, data)
  }

  // Room management
  joinRoom(room: string) {
    if (!this.socket?.connected) {
      console.warn('Cannot join room: Socket not connected')
      return
    }
    this.socket.emit('join', { room })
  }

  leaveRoom(room: string) {
    if (!this.socket?.connected) {
      console.warn('Cannot leave room: Socket not connected')
      return
    }
    this.socket.emit('leave', { room })
  }

  // Recruiter-specific methods
  subscribeToCandidate(candidateId: string) {
    this.joinRoom(`candidate:${candidateId}`)
  }

  unsubscribeFromCandidate(candidateId: string) {
    this.leaveRoom(`candidate:${candidateId}`)
  }

  subscribeToAssessment(assessmentId: string) {
    this.joinRoom(`assessment:${assessmentId}`)
  }

  unsubscribeFromAssessment(assessmentId: string) {
    this.leaveRoom(`assessment:${assessmentId}`)
  }

  // Candidate-specific methods
  startAssessmentSession(token: string, candidateId: string) {
    this.emit('assessment:session:start', { token, candidateId })
  }

  sendProctoringEvent(event: any) {
    this.emit('proctoring:event', event)
  }

  updateAssessmentProgress(progress: number, currentQuestion: number) {
    this.emit('assessment:progress:update', { progress, currentQuestion })
  }

  // Connection management
  disconnect() {
    this.stopPingMonitoring()
    
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
    
    this.state.value.isConnected = false
    this.state.value.isConnecting = false
    this.eventHandlers.clear()
  }

  reconnect() {
    this.disconnect()
    this.connect()
  }

  getState() {
    return readonly(this.state)
  }

  isConnected() {
    return this.state.value.isConnected
  }

  getLatency() {
    return this.state.value.latency
  }
}

// Singleton instance
let realtimeInstance: RealtimeConnection | null = null

export function useRealtimeConnection(options?: RealtimeOptions) {
  if (!realtimeInstance) {
    realtimeInstance = new RealtimeConnection(options)
  }

  return {
    // Connection management
    connect: (opts?: Partial<RealtimeOptions>) => realtimeInstance!.connect(opts),
    disconnect: () => realtimeInstance!.disconnect(),
    reconnect: () => realtimeInstance!.reconnect(),
    
    // State
    state: realtimeInstance.getState(),
    isConnected: () => realtimeInstance!.isConnected(),
    getLatency: () => realtimeInstance!.getLatency(),
    
    // Event handling
    on: <T extends RealtimeEvent>(event: string, handler: (data: T) => void) => 
      realtimeInstance!.on(event, handler),
    off: (event: string, handler: Function) => 
      realtimeInstance!.off(event, handler),
    emit: (event: string, data?: any) => 
      realtimeInstance!.emit(event, data),
    
    // Room management
    joinRoom: (room: string) => realtimeInstance!.joinRoom(room),
    leaveRoom: (room: string) => realtimeInstance!.leaveRoom(room),
    
    // Specific subscriptions
    subscribeToCandidate: (id: string) => realtimeInstance!.subscribeToCandidate(id),
    unsubscribeFromCandidate: (id: string) => realtimeInstance!.unsubscribeFromCandidate(id),
    subscribeToAssessment: (id: string) => realtimeInstance!.subscribeToAssessment(id),
    unsubscribeFromAssessment: (id: string) => realtimeInstance!.unsubscribeFromAssessment(id),
    
    // Assessment-specific
    startAssessmentSession: (token: string, candidateId: string) => 
      realtimeInstance!.startAssessmentSession(token, candidateId),
    sendProctoringEvent: (event: any) => 
      realtimeInstance!.sendProctoringEvent(event),
    updateAssessmentProgress: (progress: number, currentQuestion: number) => 
      realtimeInstance!.updateAssessmentProgress(progress, currentQuestion)
  }
}

// Auto-cleanup on unmount
export function useRealtimeAutoCleanup() {
  const connection = useRealtimeConnection()
  
  onUnmounted(() => {
    connection.disconnect()
  })
  
  return connection
}
