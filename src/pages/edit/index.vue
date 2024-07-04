<script setup lang='ts'>
import PathCanvas from './PathCanvas.vue'
// import PathToolPanel from './PathToolPanel.vue'
</script>

<template>
  <div class="app-wrapper h-screen w-screen flex p-[10px]">
    <!-- <div class="h-full w-[350px]">
      <PathToolPanel />
    </div> -->

    <div class="h-full flex-1">
      <PathCanvas />
    </div>
  </div>
</template>

<style scoped>
</style>
