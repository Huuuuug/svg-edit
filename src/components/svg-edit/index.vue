<script setup lang='ts'>
import PathCanvas from './canvas/PathCanvas.vue'
import PathToolPanel from './tools/PathToolPanel.vue'
import OperateToolPanel from './tools/OperateToolPanel.vue'
import CanvasZoomPanel from './tools/CanvasZoomPanel.vue'
</script>

<template>
  <div class="app-wrapper pos-relative h-screen w-screen flex">
    <div class="h-full w-[320px]">
      <PathToolPanel />
    </div>

    <div class="h-full flex-1">
      <PathCanvas />
    </div>

    <OperateToolPanel class="pos-top-1xl pos-absolute pos-right-[10px] pos-top-[10px]" />

    <CanvasZoomPanel class="pos-absolute pos-bottom-[10px] pos-right-[10px]" />
  </div>
</template>

<style scoped>
</style>
