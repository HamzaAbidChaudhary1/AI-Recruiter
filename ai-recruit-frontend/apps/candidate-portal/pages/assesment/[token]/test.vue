<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 overflow-hidden">
    <!-- Exam Mode Active Indicator -->
    <div
      v-if="examMode.isActive"
      class="fixed top-0 left-0 right-0 h-1 bg-red-500 z-50"
    />
    
    <!-- Header -->
    <header class="bg-white dark:bg-gray-800 shadow-sm relative z-40">
      <div class="px-4 py-3 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <img src="/logo.svg" alt="AI Recruit" class="h-8" />
          <div class="flex items-center gap-2">
            <Icon
              :name="isRecording ? 'heroicons:video-camera-solid' : 'heroicons:video-camera-slash'"
              :class="isRecording ? 'text-red-500 animate-pulse' : 'text-gray-400'"
              class="w-5 h-5"
            />
            <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
              {{ candidateName }}
            </span>
          </div>
        </div>
        
        <div class="flex items-center gap-6">
          <!-- Timer -->
          <div class="flex items-center gap-2">
            <Icon name="heroicons:clock" class="w-5 h-5 text-gray-500" />
            <span class="text-lg font-mono font-bold" :class="timeWarningClass">
              {{ formatTime(remainingTime) }}
            </span>
          </div>
          
          <!-- Progress -->
          <div class="flex items-center gap-2">
            <span class="text-sm text-gray-600 dark:text-gray-400">
              Question {{ currentQuestionIndex + 1 }} of {{ questions.length }}
            </span>
            <div class="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                :style="`width: ${progress}%`"
                class="h-full bg-indigo-600 transition-all duration-300"
              />
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex h-[calc(100vh-60px)]">
      <!-- Sidebar - Question Navigation -->
      <aside class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-y-auto">
        <div class="p-4">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Question Navigation
          </h3>
          <div class="grid grid-cols-5 gap-2">
            <button
              v-for="(question, index) in questions"
              :key="question.id"
              @click="navigateToQuestion(index)"
              :class="getQuestionButtonClass(index)"
              class="w-10 h-10 rounded-lg text-sm font-medium transition-all"
            >
              {{ index + 1 }}
            </button>
          </div>
          
          <!-- Legend -->
          <div class="mt-6 space-y-2">
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 bg-indigo-600 rounded" />
              <span class="text-xs text-gray-600 dark:text-gray-400">Current</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 bg-green-500 rounded" />
              <span class="text-xs text-gray-600 dark:text-gray-400">Answered</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 bg-yellow-500 rounded" />
              <span class="text-xs text-gray-600 dark:text-gray-400">Flagged</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded" />
              <span class="text-xs text-gray-600 dark:text-gray-400">Not Visited</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- Question Content -->
      <section class="flex-1 overflow-y-auto">
        <div class="p-8 max-w-4xl mx-auto">
          <!-- Question -->
          <AnimatedCard variant="elevated" class="mb-6">
            <div class="p-6">
              <div class="flex items-start justify-between mb-4">
                <div class="flex items-center gap-3">
                  <span class="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm font-medium">
                    {{ currentQuestion.type }}
                  </span>
                  <span class="text-sm text-gray-500">
                    {{ currentQuestion.points }} points
                  </span>
                </div>
                <button
                  @click="toggleFlag"
                  :class="currentQuestion.flagged ? 'text-yellow-500' : 'text-gray-400'"
                  class="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <Icon name="heroicons:flag" class="w-5 h-5" />
                </button>
              </div>
              
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                {{ currentQuestion.question }}
              </h2>
              
              <!-- Answer Area Based on Question Type -->
              <div v-if="currentQuestion.type === 'multiple-choice'" class="space-y-3">
                <label
                  v-for="(option, idx) in currentQuestion.options"
                  :key="idx"
                  class="flex items-start gap-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  :class="answers[currentQuestion.id] === idx ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-gray-200 dark:border-gray-700'"
                >
                  <input
                    type="radio"
                    :name="`question-${currentQuestion.id}`"
                    :value="idx"
                    v-model="answers[currentQuestion.id]"
                    class="mt-1"
                  />
                  <span class="text-gray-700 dark:text-gray-300">{{ option }}</span>
                </label>
              </div>
              
              <div v-else-if="currentQuestion.type === 'essay'" class="space-y-3">
                <textarea
                  v-model="answers[currentQuestion.id]"
                  placeholder="Type your answer here..."
                  class="w-full h-64 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  :class="isDark ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'"
                />
                <div class="text-sm text-gray-500">
                  {{ (answers[currentQuestion.id] || '').length }} / 2000 characters
                </div>
              </div>
              
              <div v-else-if="currentQuestion.type === 'coding'" class="space-y-3">
                <CodeEditor
                  v-model="answers[currentQuestion.id]"
                  :language="currentQuestion.language || 'javascript'"
                  :theme="isDark ? 'dark' : 'light'"
                  class="h-96"
                />
              </div>
              
              <div v-else-if="currentQuestion.type === 'video'" class="space-y-4">
                <VideoRecorder
                  ref="videoRecorder"
                  @recording-complete="handleVideoRecording"
                  :max-duration="300"
                  :show-preview="true"
                />
              </div>
            </div>
          </AnimatedCard>

          <!-- Navigation Buttons -->
          <div class="flex items-center justify-between">
            <button
              @click="previousQuestion"
              :disabled="currentQuestionIndex === 0"
              class="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ← Previous
            </button>
            
            <div class="flex items-center gap-3">
              <button
                @click="saveAnswer"
                class="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Save Answer
              </button>
              
              <button
                v-if="currentQuestionIndex < questions.length - 1"
                @click="nextQuestion"
                class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Next →
              </button>
              
              <button
                v-else
                @click="showSubmitModal = true"
                class="px-8 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Assessment
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Video Preview (Proctoring) -->
      <aside v-if="proctoring.state.isActive" class="w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
        <div class="p-4">
          <h3 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Proctoring Active
          </h3>
          <div class="relative rounded-lg overflow-hidden bg-black aspect-video">
            <video
              ref="proctoringVideo"
              autoplay
              muted
              class="w-full h-full object-cover"
            />
            <div class="absolute bottom-2 right-2 flex items-center gap-1">
              <span class="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              <span class="text-xs text-white">REC</span>
            </div>
          </div>
          
          <!-- Violations -->
          <div v-if="violations.length > 0" class="mt-4">
            <h4 class="text-xs font-semibold text-red-600 mb-2">
              Warnings ({{ violations.length }})
            </h4>
            <div class="space-y-1">
              <div
                v-for="(violation, idx) in violations.slice(-3)"
                :key="idx"
                class="text-xs text-gray-600 dark:text-gray-400"
              >
                {{ violation }}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </main>

    <!-- Submit Confirmation Modal -->
    <Teleport to="body">
      <div
        v-if="showSubmitModal"
        class="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      >
        <AnimatedCard variant="elevated" class="max-w-md w-full mx-4">
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Submit Assessment?
            </h3>
            
            <div class="space-y-3 mb-6">
              <p class="text-gray-600 dark:text-gray-400">
                Are you sure you want to submit your assessment?
              </p>
              
              <div class="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
                <p class="text-sm text-yellow-800 dark:text-yellow-300">
                  <strong>Warning:</strong> You have {{ unansweredCount }} unanswered questions
                  and {{ flaggedCount }} flagged questions.
                </p>
              </div>
              
              <div class="text-sm text-gray-500">
                Once submitted, you cannot make any changes.
              </div>
            </div>
            
            <div class="flex items-center gap-3">
              <button
                @click="showSubmitModal = false"
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Review Answers
              </button>
              <button
                @click="submitAssessment"
                class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Submit Now
              </button>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useColorMode } from '@vueuse/core'
import { useExamMode } from '@ai-recruit/composables/exam'
import { useProctoring } from '@ai-recruit/composables/proctoring'
import { useAssessmentStore } from '~/stores/assessment'
import { gsap } from 'gsap'

// Route & Router
const route = useRoute()
const router = useRouter()
const { isDark } = useColorMode()

// Store
const assessmentStore = useAssessmentStore()

// Refs
const proctoringVideo = ref<HTMLVideoElement>()
const videoRecorder = ref()
const showSubmitModal = ref(false)
const currentQuestionIndex = ref(0)
const remainingTime = ref(3600) // 60 minutes in seconds
const answers = ref<Record<string, any>>({})
const violations = ref<string[]>([])
const isRecording = ref(false)

// Mock data (would come from API)
const candidateName = ref('John Doe')
const questions = ref([
  {
    id: '1',
    type: 'multiple-choice',
    question: 'Which of the following is NOT a JavaScript framework?',
    options: ['React', 'Vue', 'Angular', 'Django'],
    points: 10,
    flagged: false,
    visited: false
  },
  {
    id: '2',
    type: 'essay',
    question: 'Explain the concept of closures in JavaScript and provide an example use case.',
    points: 20,
    flagged: false,
    visited: false
  },
  {
    id: '3',
    type: 'coding',
    question: 'Write a function that reverses a linked list.',
    language: 'javascript',
    points: 30,
    flagged: false,
    visited: false
  },
  {
    id: '4',
    type: 'video',
    question: 'Record a 2-minute video explaining your approach to solving complex problems.',
    points: 25,
    flagged: false,
    visited: false
  },
  {
    id: '5',
    type: 'multiple-choice',
    question: 'What is the time complexity of quicksort in the average case?',
    options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'],
    points: 15,
    flagged: false,
    visited: false
  }
])

// Composables
const examMode = useExamMode({
  preventRightClick: true,
  preventTextSelection: false, // Allow for coding questions
  preventDevTools: true,
  preventPrint: true,
  enforceFullscreen: true,
  detectTabSwitch: true,
  maxTabSwitches: 3,
  onViolation: (type) => {
    violations.value.push(`${type} detected at ${new Date().toLocaleTimeString()}`)
    console.warn('Violation detected:', type)
  },
  onIdleTimeout: () => {
    console.warn('Idle timeout reached')
    submitAssessment()
  }
})

const proctoring = useProctoring({
  video: true,
  audio: true,
  screen: false,
  detectMultipleFaces: true,
  detectNoFace: true,
  recordVideo: true,
  onMultipleFaces: () => {
    violations.value.push('Multiple faces detected')
  },
  onNoFace: () => {
    violations.value.push('No face detected')
  },
  onCameraDisconnected: () => {
    violations.value.push('Camera disconnected')
  }
})

// Computed
const currentQuestion = computed(() => questions.value[currentQuestionIndex.value])

const progress = computed(() => {
  return ((currentQuestionIndex.value + 1) / questions.value.length) * 100
})

const timeWarningClass = computed(() => {
  if (remainingTime.value < 300) return 'text-red-600' // Less than 5 minutes
  if (remainingTime.value < 600) return 'text-yellow-600' // Less than 10 minutes
  return 'text-gray-700 dark:text-gray-300'
})

const unansweredCount = computed(() => {
  return questions.value.filter(q => !answers.value[q.id]).length
})

const flaggedCount = computed(() => {
  return questions.value.filter(q => q.flagged).length
})

// Methods
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const getQuestionButtonClass = (index: number) => {
  const question = questions.value[index]
  
  if (index === currentQuestionIndex.value) {
    return 'bg-indigo-600 text-white'
  }
  if (question.flagged) {
    return 'bg-yellow-500 text-white'
  }
  if (answers.value[question.id]) {
    return 'bg-green-500 text-white'
  }
  if (question.visited) {
    return 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
  }
  return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
}

const navigateToQuestion = (index: number) => {
  // Mark current question as visited
  questions.value[currentQuestionIndex.value].visited = true
  
  // Navigate with animation
  gsap.to(window, {
    scrollTo: { y: 0 },
    duration: 0.3
  })
  
  currentQuestionIndex.value = index
}

const previousQuestion = () => {
  if (currentQuestionIndex.value > 0) {
    navigateToQuestion(currentQuestionIndex.value - 1)
  }
}

const nextQuestion = () => {
  if (currentQuestionIndex.value < questions.value.length - 1) {
    navigateToQuestion(currentQuestionIndex.value + 1)
  }
}

const toggleFlag = () => {
  currentQuestion.value.flagged = !currentQuestion.value.flagged
}

const saveAnswer = () => {
  // Auto-save is typically handled, but this provides explicit save
  console.log('Answer saved for question', currentQuestion.value.id)
  
  // Show save animation
  const toast = useToast()
  toast.add({
    title: 'Answer Saved',
    description: 'Your answer has been saved successfully.',
    icon: 'i-heroicons-check-circle',
    timeout: 2000
  })
}

const handleVideoRecording = (blob: Blob) => {
  answers.value[currentQuestion.value.id] = blob
  console.log('Video recorded:', blob.size, 'bytes')
}

const submitAssessment = async () => {
  // Stop exam mode and proctoring
  examMode.stop()
  const recordings = await proctoring.stop()
  
  // Prepare submission data
  const submission = {
    token: route.params.token,
    answers: answers.value,
    violations: violations.value,
    duration: 3600 - remainingTime.value,
    recordings: recordings
  }
  
  // Submit to API
  try {
    await assessmentStore.submitAssessment(submission)
    
    // Navigate to completion page
    router.push(`/assessment/${route.params.token}/complete`)
  } catch (error) {
    console.error('Submission failed:', error)
  }
}

// Timer
let timerInterval: NodeJS.Timeout

const startTimer = () => {
  timerInterval = setInterval(() => {
    remainingTime.value--
    
    if (remainingTime.value === 300) {
      // 5 minute warning
      const toast = useToast()
      toast.add({
        title: '5 Minutes Remaining',
        description: 'You have 5 minutes left to complete the assessment.',
        icon: 'i-heroicons-exclamation-triangle',
        color: 'yellow',
        timeout: 5000
      })
    }
    
    if (remainingTime.value === 0) {
      // Auto-submit
      submitAssessment()
    }
  }, 1000)
}

// Lifecycle
onMounted(async () => {
  // Start exam mode
  await examMode.start()
  
  // Start proctoring
  if (proctoringVideo.value) {
    await proctoring.start(
      ref(proctoringVideo),
      ref(document.createElement('canvas'))
    )
    isRecording.value = true
  }
  
  // Start timer
  startTimer()
  
  // Mark first question as visited
  questions.value[0].visited = true
  
  // Prevent page navigation
  window.onbeforeunload = (e) => {
    e.preventDefault()
    e.returnValue = 'Are you sure you want to leave? Your progress will be lost.'
  }
})

onUnmounted(() => {
  clearInterval(timerInterval)
  examMode.stop()
  proctoring.stop()
  window.onbeforeunload = null
})
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  @apply bg-gray-100 dark:bg-gray-800;
}

::-webkit-scrollbar-thumb {
  @apply bg-gray-400 dark:bg-gray-600 rounded;
}

::-webkit-scrollbar-thumb:hover {
  @apply bg-gray-500 dark:bg-gray-500;
}
</style>
