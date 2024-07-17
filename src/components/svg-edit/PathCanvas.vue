<script setup lang='ts'>
import Canvas from './Canvas.vue'
import { useComposition } from './core'
import { initCanvas, initEventListener, initSvgPath } from './PathCanvas.module'
import { useSvgPathStore } from '~/stores/svg-path'

const props = useSvgPathStore()

const canvas = ref<HTMLElement | null>(null)

onMounted(() => {
  // 初始化画布
  initCanvas()
  // 初始化Svg Path
  initSvgPath()
  // 初始化页面监听事件
  initEventListener()
})

watch(() => props.rawPath, (val?: string) => {
  if (!val)
    return
  if (props.foucusedItem)
    return
  const { reloadPath } = useComposition()
  reloadPath(val)
})
</script>

<template>
  <div id="canvas" ref="canvas" class="h-full w-full">
    <Canvas
      :view-port-x="props.cfg.viewPortX"
      :view-port-y="props.cfg.viewPortY"
      :view-port-width="props.cfg.viewPortWidth"
      :view-port-height="props.cfg.viewPortHeight"
      :stroke-width="props.strokeWidth"
      :canvas-width="props.canvasWidth"
      :canvas-height="props.canvasHeight"
      :parsed-path="props.parsedPath"
    />
  </div>
</template>

<style scoped>
</style>
