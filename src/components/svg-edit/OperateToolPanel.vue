<script setup lang='ts'>
import { useOperateToolPanel } from './OperateToolPanel.module'

const { undo, redo } = useOperateToolPanel()
</script>

<template>
  <div class="flex flex-row gap-2">
    <button class="h-10 w-10 rounded-full bg-[#424242] hover:bg-[#545454]" @click="undo">
      <div class="i-ph:arrow-arc-left-bold h-5 w-5" />
    </button>

    <button class="h-10 w-10 rounded-full bg-[#424242] hover:bg-[#545454]" @click="redo">
      <div class="i-ph:arrow-arc-right-bold h-5 w-5" />
    </button>
  </div>
</template>

<style scoped>
</style>
