<script setup lang="ts">
import AnimatedCard from '@ai-recruit/ui/components/AnimatedCard.vue'
import StatsCard from '@ai-recruit/ui/components/StatsCard.vue'
<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
    <!-- Header -->
    <header class="sticky top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div class="px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
              AI Recruit Dashboard
            </h1>
          </div>
          
          <div class="flex items-center gap-4">
            <button
              @click="toggleDarkMode"
              class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <Icon :name="isDark ? 'heroicons:sun' : 'heroicons:moon'" class="w-5 h-5" />
            </button>
            
            <div class="relative">
              <button class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <Icon name="heroicons:bell" class="w-5 h-5" />
                <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
            </div>
            
            <div class="flex items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=John+Doe&background=4F46E5&color=fff"
                alt="Profile"
                class="w-8 h-8 rounded-full"
              >
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">John Doe</span>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="p-4 sm:p-6 lg:p-8">
      <!-- Stats Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          v-for="stat in stats"
          :key="stat.label"
          :label="stat.label"
          :value="stat.value"
          :change="stat.change"
          :icon="stat.icon"
          :color="stat.color"
        />
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Pipeline Chart -->
        <AnimatedCard variant="elevated" class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Recruitment Pipeline
            </h2>
            <button class="text-sm text-indigo-600 hover:text-indigo-700">
              View Details →
            </button>
          </div>
          <div ref="pipelineChart" class="h-80" />
        </AnimatedCard>

        <!-- Performance Chart -->
        <AnimatedCard variant="elevated" class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Assessment Performance
            </h2>
            <select class="text-sm border rounded-lg px-3 py-1">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div ref="performanceChart" class="h-80" />
        </AnimatedCard>
      </div>

      <!-- Active Candidates -->
      <AnimatedCard variant="elevated" class="mb-8">
        <div class="p-6">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">
              Active Candidates
            </h2>
            <div class="flex items-center gap-4">
              <div class="relative">
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Search candidates..."
                  class="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
                >
                <Icon
                  name="heroicons:magnifying-glass"
                  class="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                />
              </div>
              <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                + Add Candidate
              </button>
            </div>
          </div>

          <!-- Candidates Table -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Candidate
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Role
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Score
                  </th>
                  <th class="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="candidate in filteredCandidates"
                  :key="candidate.id"
                  class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-3">
                      <img
                        :src="candidate.avatar"
                        :alt="candidate.name"
                        class="w-10 h-10 rounded-full"
                      >
                      <div>
                        <p class="font-medium text-gray-900 dark:text-white">
                          {{ candidate.name }}
                        </p>
                        <p class="text-sm text-gray-500">{{ candidate.email }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="py-4 px-4 text-gray-700 dark:text-gray-300">
                    {{ candidate.role }}
                  </td>
                  <td class="py-4 px-4">
                    <span
                      :class="getStatusClass(candidate.status)"
                      class="px-3 py-1 rounded-full text-xs font-medium"
                    >
                      {{ candidate.status }}
                    </span>
                  </td>
                  <td class="py-4 px-4">
                    <div v-if="candidate.score" class="flex items-center gap-2">
                      <div class="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          :style="`width: ${candidate.score}%`"
                          :class="getScoreClass(candidate.score)"
                          class="h-2 rounded-full transition-all duration-500"
                        />
                      </div>
                      <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {{ candidate.score }}%
                      </span>
                    </div>
                    <span v-else class="text-sm text-gray-400">-</span>
                  </td>
                  <td class="py-4 px-4">
                    <div class="flex items-center gap-2">
                      <button class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Icon name="heroicons:eye" class="w-5 h-5 text-gray-600" />
                      </button>
                      <button class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Icon name="heroicons:chat-bubble-left" class="w-5 h-5 text-gray-600" />
                      </button>
                      <button class="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                        <Icon name="heroicons:ellipsis-vertical" class="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </AnimatedCard>

      <!-- Real-time Activity Feed -->
      <AnimatedCard variant="gradient" gradient-from="from-indigo-500" gradient-to="to-purple-600">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-white mb-4">Live Activity</h3>
          <div class="space-y-3">
            <div
              v-for="activity in recentActivities"
              :key="activity.id"
              class="flex items-center gap-3 p-3 bg-white/10 backdrop-blur rounded-lg"
            >
              <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <p class="text-sm text-white">
                {{ activity.message }}
              </p>
              <span class="text-xs text-white/70 ml-auto">
                {{ activity.time }}
              </span>
            </div>
          </div>
        </div>
      </AnimatedCard>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, FunnelChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useColorMode } from '@vueuse/core'
import { gsap } from 'gsap'

// Register ECharts components
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  BarChart,
  LineChart,
  FunnelChart,
  CanvasRenderer
])

// Composables
const { isDark, toggleDarkMode } = useColorMode()

// Refs
const pipelineChart = ref<HTMLDivElement>()
const performanceChart = ref<HTMLDivElement>()
const searchQuery = ref('')

// Data
const stats = ref([
  {
    label: 'Total Candidates',
    value: '1,284',
    change: '+12.5%',
    icon: 'heroicons:users',
    color: 'indigo'
  },
  {
    label: 'Active Assessments',
    value: '42',
    change: '+3',
    icon: 'heroicons:clipboard-document-check',
    color: 'green'
  },
  {
    label: 'Completion Rate',
    value: '78.5%',
    change: '+5.2%',
    icon: 'heroicons:chart-bar',
    color: 'blue'
  },
  {
    label: 'Avg. Score',
    value: '82.3',
    change: '+2.1',
    icon: 'heroicons:academic-cap',
    color: 'purple'
  }
])

const candidates = ref([
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah.j@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=random',
    role: 'Frontend Developer',
    status: 'in-progress',
    score: null
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael.c@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=random',
    role: 'Full Stack Developer',
    status: 'completed',
    score: 92
  },
  {
    id: '3',
    name: 'Emily Williams',
    email: 'emily.w@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Emily+Williams&background=random',
    role: 'Backend Developer',
    status: 'completed',
    score: 85
  },
  {
    id: '4',
    name: 'James Rodriguez',
    email: 'james.r@example.com',
    avatar: 'https://ui-avatars.com/api/?name=James+Rodriguez&background=random',
    role: 'DevOps Engineer',
    status: 'pending',
    score: null
  },
  {
    id: '5',
    name: 'Lisa Anderson',
    email: 'lisa.a@example.com',
    avatar: 'https://ui-avatars.com/api/?name=Lisa+Anderson&background=random',
    role: 'Frontend Developer',
    status: 'completed',
    score: 78
  }
])

const recentActivities = ref([
  {
    id: '1',
    message: 'Sarah Johnson started Frontend Developer assessment',
    time: '2 min ago'
  },
  {
    id: '2',
    message: 'Michael Chen completed Full Stack assessment (Score: 92%)',
    time: '15 min ago'
  },
  {
    id: '3',
    message: 'New candidate registered: Alex Turner',
    time: '23 min ago'
  },
  {
    id: '4',
    message: 'Emily Williams submitted video responses',
    time: '45 min ago'
  }
])

// Computed
const filteredCandidates = computed(() => {
  if (!searchQuery.value) return candidates.value
  
  const query = searchQuery.value.toLowerCase()
  return candidates.value.filter(candidate =>
    candidate.name.toLowerCase().includes(query) ||
    candidate.email.toLowerCase().includes(query) ||
    candidate.role.toLowerCase().includes(query)
  )
})

// Methods
const getStatusClass = (status: string) => {
  const classes = {
    'pending': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    'completed': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    'reviewed': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400'
  }
  return classes[status as keyof typeof classes] || ''
}

const getScoreClass = (score: number) => {
  if (score >= 90) return 'bg-green-500'
  if (score >= 75) return 'bg-blue-500'
  if (score >= 60) return 'bg-yellow-500'
  return 'bg-red-500'
}

// Initialize charts
const initCharts = () => {
  // Pipeline Chart
  if (pipelineChart.value) {
    const chart = echarts.init(pipelineChart.value, isDark.value ? 'dark' : null)
    
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} candidates'
      },
      series: [
        {
          type: 'funnel',
          left: '10%',
          top: 60,
          bottom: 60,
          width: '80%',
          min: 0,
          max: 100,
          minSize: '0%',
          maxSize: '100%',
          sort: 'descending',
          gap: 2,
          label: {
            show: true,
            position: 'inside'
          },
          labelLine: {
            length: 10,
            lineStyle: {
              width: 1,
              type: 'solid'
            }
          },
          itemStyle: {
            borderColor: '#fff',
            borderWidth: 1
          },
          emphasis: {
            label: {
              fontSize: 20
            }
          },
          data: [
            { value: 100, name: 'Applied', itemStyle: { color: '#6366F1' } },
            { value: 80, name: 'Screening', itemStyle: { color: '#8B5CF6' } },
            { value: 60, name: 'Assessment', itemStyle: { color: '#EC4899' } },
            { value: 40, name: 'Interview', itemStyle: { color: '#F59E0B' } },
            { value: 20, name: 'Offer', itemStyle: { color: '#10B981' } }
          ]
        }
      ]
    }
    
    chart.setOption(option)
    
    // Responsive
    window.addEventListener('resize', () => chart.resize())
  }
  
  // Performance Chart
  if (performanceChart.value) {
    const chart = echarts.init(performanceChart.value, isDark.value ? 'dark' : null)
    
    const option = {
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['Average Score', 'Completion Rate']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'Average Score',
          type: 'line',
          smooth: true,
          data: [82, 85, 79, 86, 88, 83, 90],
          itemStyle: { color: '#6366F1' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
              { offset: 1, color: 'rgba(99, 102, 241, 0)' }
            ])
          }
        },
        {
          name: 'Completion Rate',
          type: 'line',
          smooth: true,
          data: [75, 78, 72, 80, 85, 77, 82],
          itemStyle: { color: '#10B981' },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: 'rgba(16, 185, 129, 0.3)' },
              { offset: 1, color: 'rgba(16, 185, 129, 0)' }
            ])
          }
        }
      ]
    }
    
    chart.setOption(option)
    
    // Responsive
    window.addEventListener('resize', () => chart.resize())
  }
}

// Lifecycle
onMounted(() => {
  initCharts()
  
  // Animate stats on mount
  gsap.from('.stats-card', {
    y: 20,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1
  })
})

onUnmounted(() => {
  if (pipelineChart.value) {
    echarts.dispose(pipelineChart.value)
  }
  if (performanceChart.value) {
    echarts.dispose(performanceChart.value)
  }
})
</script>
