<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 relative overflow-hidden">
    <div class="flex items-center justify-between">
      <div>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-900 dark:text-white mt-1">{{ value }}</p>
        <p v-if="change" :class="changeClass" class="text-sm mt-2">
          {{ change }} from last period
        </p>
      </div>
      <div :class="`bg-${color}-100 dark:bg-${color}-900/30 p-3 rounded-lg`">
        <Icon :name="icon" :class="`w-6 h-6 text-${color}-600 dark:text-${color}-400`" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string
  value: string | number
  change?: string
  icon: string
  color?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: 'indigo'
})

const changeClass = computed(() => {
  if (!props.change) return ''
  return props.change.startsWith('+') 
    ? 'text-green-600 dark:text-green-400' 
    : 'text-red-600 dark:text-red-400'
})
</script>
