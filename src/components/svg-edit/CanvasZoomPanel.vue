<script setup lang='ts'>
import { useComposition } from './core'

const { zoomAuto, zoomViewPort } = useComposition()

function zoomIn() {
  zoomViewPort(1.002 ** -100)
}

function zoomReset() {
  zoomAuto()
}

function zoomOut() {
  zoomViewPort(1.002 ** 100)
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <n-tooltip placement="left" :show-arrow="false" trigger="hover" :style="{ padding: '4px 6px' }">
      <template #trigger>
        <button class="h-10 w-10 rounded-full bg-[#424242] hover:bg-[#545454]" @click="zoomIn">
          <div class="i-bytesize:zoom-in h-5 w-5" />
        </button>
      </template>
      Zoom in
    </n-tooltip>

    <n-tooltip placement="left" :show-arrow="false" trigger="hover" :style="{ padding: '4px 6px' }">
      <template #trigger>
        <button class="h-10 w-10 rounded-full bg-[#424242] hover:bg-[#545454]" @click="zoomReset">
          <div class="i-bytesize:zoom-reset h-5 w-5" />
        </button>
      </template>
      Zoom reset
    </n-tooltip>

    <n-tooltip placement="left" :show-arrow="false" trigger="hover" :style="{ padding: '4px 6px' }">
      <template #trigger>
        <button class="h-10 w-10 rounded-full bg-[#424242] hover:bg-[#545454]" @click="zoomOut">
          <div class="i-bytesize:zoom-out h-5 w-5" />
        </button>
      </template>
      Zoom out
    </n-tooltip>
  </div>
</template>

<style scoped>
</style>
