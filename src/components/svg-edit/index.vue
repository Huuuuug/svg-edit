<script setup lang='ts'>
import PathCanvas from './PathCanvas.vue'
import PathToolPanel from './PathToolPanel.vue'
import OperateToolPanel from './OperateToolPanel.vue'
</script>

<template>
  <div class="app-wrapper pos-relative h-screen w-screen flex p-[10px]">
    <div class="h-full w-[320px]">
      <PathToolPanel />
    </div>

    <div class="h-full flex-1">
      <PathCanvas />
    </div>

    <div class="pos-absolute pos-right-2xl">
      <OperateToolPanel />
    </div>
  </div>
</template>

<style scoped>
</style>
