import { ref, onUnmounted, Ref } from 'vue'
import RecordRTC from 'recordrtc'

export interface ProctoringOptions {
  video: boolean
  audio: boolean
  screen: boolean
  detectMultipleFaces?: boolean
  detectNoFace?: boolean
  recordVideo?: boolean
  recordScreen?: boolean
  checkInterval?: number // milliseconds
  onMultipleFaces?: () => void
  onNoFace?: () => void
  onCameraDisconnected?: () => void
  onMicrophoneDisconnected?: () => void
  onScreenShareEnded?: () => void
}

export interface ProctoringState {
  isActive: boolean
  hasCamera: boolean
  hasMicrophone: boolean
  isRecording: boolean
  isScreenSharing: boolean
  cameraStream: MediaStream | null
  screenStream: MediaStream | null
  violations: ProctoringViolation[]
}

export interface ProctoringViolation {
  type: 'multiple-faces' | 'no-face' | 'camera-disconnected' | 'microphone-disconnected' | 'screen-share-ended'
  timestamp: number
  screenshot?: string
}

export function useProctoring(options: ProctoringOptions) {
  const {
    video = true,
    audio = true,
    screen = false,
    detectMultipleFaces = true,
    detectNoFace = true,
    recordVideo = false,
    recordScreen = false,
    checkInterval = 5000,
    onMultipleFaces = () => {},
    onNoFace = () => {},
    onCameraDisconnected = () => {},
    onMicrophoneDisconnected = () => {},
    onScreenShareEnded = () => {}
  } = options

  const state = ref<ProctoringState>({
    isActive: false,
    hasCamera: false,
    hasMicrophone: false,
    isRecording: false,
    isScreenSharing: false,
    cameraStream: null,
    screenStream: null,
    violations: []
  })

  const videoElement = ref<HTMLVideoElement | null>(null)
  const canvasElement = ref<HTMLCanvasElement | null>(null)
  
  let cameraRecorder: RecordRTC | null = null
  let screenRecorder: RecordRTC | null = null
  let faceDetectionInterval: NodeJS.Timeout | null = null
  let deviceCheckInterval: NodeJS.Timeout | null = null

  // Check available devices
  const checkDevices = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      state.value.hasCamera = devices.some(device => device.kind === 'videoinput')
      state.value.hasMicrophone = devices.some(device => device.kind === 'audioinput')
    } catch (error) {
      console.error('Error checking devices:', error)
    }
  }

  // Request camera and microphone permissions
  const requestPermissions = async (): Promise<boolean> => {
    try {
      const constraints: MediaStreamConstraints = {
        video: video ? {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        } : false,
        audio: audio ? {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } : false
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      state.value.cameraStream = stream

      // Set up video element for face detection
      if (video && videoElement.value) {
        videoElement.value.srcObject = stream
        await videoElement.value.play()
      }

      return true
    } catch (error) {
      console.error('Permission denied:', error)
      return false
    }
  }

  // Start screen sharing
  const startScreenShare = async (): Promise<boolean> => {
    if (!screen) return true

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor'
        },
        audio: false
      })

      state.value.screenStream = stream
      state.value.isScreenSharing = true

      // Listen for screen share end
      stream.getVideoTracks()[0].addEventListener('ended', () => {
        state.value.isScreenSharing = false
        state.value.violations.push({
          type: 'screen-share-ended',
          timestamp: Date.now()
        })
        onScreenShareEnded()
      })

      return true
    } catch (error) {
      console.error('Screen share denied:', error)
      return false
    }
  }

  // Face detection using canvas (simplified - in production use ML model)
  const detectFaces = async () => {
    if (!video || !videoElement.value || !canvasElement.value) return

    const video = videoElement.value
    const canvas = canvasElement.value
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    // In production, use face-api.js or similar
    // This is a placeholder for face detection logic
    try {
      // Simulated face detection
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height)
      const faceCount = simulateFaceDetection(imageData)

      if (detectMultipleFaces && faceCount > 1) {
        const screenshot = canvas.toDataURL('image/jpeg', 0.5)
        state.value.violations.push({
          type: 'multiple-faces',
          timestamp: Date.now(),
          screenshot
        })
        onMultipleFaces()
      }

      if (detectNoFace && faceCount === 0) {
        const screenshot = canvas.toDataURL('image/jpeg', 0.5)
        state.value.violations.push({
          type: 'no-face',
          timestamp: Date.now(),
          screenshot
        })
        onNoFace()
      }
    } catch (error) {
      console.error('Face detection error:', error)
    }
  }

  // Simulate face detection (replace with actual ML model)
  const simulateFaceDetection = (imageData: ImageData): number => {
    // Placeholder: In production, use TensorFlow.js or face-api.js
    // This is just checking for skin-tone pixels as a very rough approximation
    const data = imageData.data
    let skinPixels = 0
    
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Very rough skin tone detection
      if (r > 95 && g > 40 && b > 20 && r > g && r > b && Math.abs(r - g) > 15) {
        skinPixels++
      }
    }
    
    const skinPercentage = skinPixels / (imageData.width * imageData.height)
    
    if (skinPercentage > 0.15) return 1 // Face detected
    if (skinPercentage > 0.30) return 2 // Multiple faces (rough estimate)
    return 0 // No face
  }

  // Check device connectivity
  const checkDeviceConnectivity = () => {
    if (state.value.cameraStream) {
      const videoTracks = state.value.cameraStream.getVideoTracks()
      const audioTracks = state.value.cameraStream.getAudioTracks()

      // Check camera
      if (video && videoTracks.length > 0) {
        const isActive = videoTracks.some(track => track.readyState === 'live')
        if (!isActive) {
          state.value.violations.push({
            type: 'camera-disconnected',
            timestamp: Date.now()
          })
          onCameraDisconnected()
        }
      }

      // Check microphone
      if (audio && audioTracks.length > 0) {
        const isActive = audioTracks.some(track => track.readyState === 'live')
        if (!isActive) {
          state.value.violations.push({
            type: 'microphone-disconnected',
            timestamp: Date.now()
          })
          onMicrophoneDisconnected()
        }
      }
    }
  }

  // Start recording
  const startRecording = () => {
    if (recordVideo && state.value.cameraStream) {
      cameraRecorder = new RecordRTC(state.value.cameraStream, {
        type: 'video',
        mimeType: 'video/webm',
        videoBitsPerSecond: 128000,
        frameInterval: 20
      })
      cameraRecorder.startRecording()
    }

    if (recordScreen && state.value.screenStream) {
      screenRecorder = new RecordRTC(state.value.screenStream, {
        type: 'video',
        mimeType: 'video/webm',
        videoBitsPerSecond: 512000
      })
      screenRecorder.startRecording()
    }

    state.value.isRecording = true
  }

  // Stop recording and get blob
  const stopRecording = async (): Promise<{ camera?: Blob, screen?: Blob }> => {
    const recordings: { camera?: Blob, screen?: Blob } = {}

    if (cameraRecorder) {
      await new Promise<void>(resolve => {
        cameraRecorder!.stopRecording(() => {
          recordings.camera = cameraRecorder!.getBlob()
          resolve()
        })
      })
    }

    if (screenRecorder) {
      await new Promise<void>(resolve => {
        screenRecorder!.stopRecording(() => {
          recordings.screen = screenRecorder!.getBlob()
          resolve()
        })
      })
    }

    state.value.isRecording = false
    return recordings
  }

  // Initialize proctoring
  const start = async (
    videoEl?: Ref<HTMLVideoElement | null>,
    canvasEl?: Ref<HTMLCanvasElement | null>
  ): Promise<boolean> => {
    if (videoEl) videoElement.value = videoEl.value
    if (canvasEl) canvasElement.value = canvasEl.value

    await checkDevices()

    const hasPermissions = await requestPermissions()
    if (!hasPermissions) return false

    if (screen) {
      const hasScreenShare = await startScreenShare()
      if (!hasScreenShare && screen) return false
    }

    state.value.isActive = true
    state.value.violations = []

    // Start monitoring
    if (detectMultipleFaces || detectNoFace) {
      faceDetectionInterval = setInterval(detectFaces, checkInterval)
    }

    deviceCheckInterval = setInterval(checkDeviceConnectivity, 2000)

    // Start recording if enabled
    if (recordVideo || recordScreen) {
      startRecording()
    }

    return true
  }

  // Stop proctoring
  const stop = async () => {
    state.value.isActive = false

    // Stop recordings
    let recordings = {}
    if (state.value.isRecording) {
      recordings = await stopRecording()
    }

    // Stop streams
    if (state.value.cameraStream) {
      state.value.cameraStream.getTracks().forEach(track => track.stop())
      state.value.cameraStream = null
    }

    if (state.value.screenStream) {
      state.value.screenStream.getTracks().forEach(track => track.stop())
      state.value.screenStream = null
    }

    // Clear intervals
    if (faceDetectionInterval) {
      clearInterval(faceDetectionInterval)
      faceDetectionInterval = null
    }

    if (deviceCheckInterval) {
      clearInterval(deviceCheckInterval)
      deviceCheckInterval = null
    }

    // Clear video element
    if (videoElement.value) {
      videoElement.value.srcObject = null
    }

    return recordings
  }

  // Take screenshot
  const takeScreenshot = (): string | null => {
    if (!videoElement.value || !canvasElement.value) return null

    const canvas = canvasElement.value
    const context = canvas.getContext('2d')
    if (!context) return null

    canvas.width = videoElement.value.videoWidth
    canvas.height = videoElement.value.videoHeight
    context.drawImage(videoElement.value, 0, 0)

    return canvas.toDataURL('image/jpeg', 0.8)
  }

  onUnmounted(() => {
    stop()
  })

  return {
    state: readonly(state),
    start,
    stop,
    takeScreenshot,
    checkDevices,
    requestPermissions,
    startScreenShare
  }
}
