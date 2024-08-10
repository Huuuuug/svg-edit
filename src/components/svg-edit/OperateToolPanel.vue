<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useOperateToolPanel } from './OperateToolPanel.module'
import { useSvgPathStore } from '~/stores/svg-path'

const { undo, redo } = useOperateToolPanel()
const { currentHistoryIndex, changeHistory } = storeToRefs(useSvgPathStore())

const canUndo = computed(() => currentHistoryIndex.value > 0)
const canRedo = computed(() => currentHistoryIndex.value < changeHistory.value.length - 1 && changeHistory.value.length > 0,
)
</script>

<template>
  <div class="flex flex-row gap-2">
    <n-tooltip v-if="canUndo" :show-arrow="false" trigger="hover" :style="{ padding: '4px 6px' }">
      <template #trigger>
        <button class="h-10 w-10 rounded-full bg-[#424242] hover:bg-[#545454]" @click="undo">
          <div class="i-ph:arrow-arc-left-bold h-5 w-5" />
        </button>
      </template>
      undo
    </n-tooltip>
    <button v-else class="h-10 w-10 rounded-full bg-[#424242] opacity-50">
      <div class="i-ph:arrow-arc-left-bold h-5 w-5" />
    </button>

    <n-tooltip v-if="canRedo" :show-arrow="false" trigger="hover" :style="{ padding: '4px 6px' }">
      <template #trigger>
        <button class="h-10 w-10 rounded-full bg-[#424242] hover:bg-[#545454]" @click="redo">
          <div class="i-ph:arrow-arc-right-bold h-5 w-5" />
        </button>
      </template>
      redo
    </n-tooltip>
    <button v-else class="h-10 w-10 rounded-full bg-[#424242] opacity-50">
      <div class="i-ph:arrow-arc-right-bold h-5 w-5" />
    </button>
  </div>
</template>

<style scoped>
</style>
