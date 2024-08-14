<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useMessage } from 'naive-ui'
import { browserComputePathBoundingBox } from './svg-parser'
import { useSvgPathStore } from '~/stores/svg-path'

const emits = defineEmits(['cancel', 'success'])

const message = useMessage()

const { cfg, rawPath } = storeToRefs(useSvgPathStore())

const { viewPortX, viewPortY, viewPortWidth, viewPortHeight } = cfg.value

const svgBoundaryBox = computed(() => {
  if (!rawPath.value)
    return { x: 0, y: 0, width: 0, height: 0 }
  return browserComputePathBoundingBox(rawPath.value)
})

const exportOptions = reactive({
  isFill: false,
  isStroke: true,
  fillColor: '',
  strokeColor: '#FF0000',
  strokeWidth: '0.1',
  x: svgBoundaryBox.value.x.toPrecision(4),
  y: svgBoundaryBox.value.y.toPrecision(4),
  width: svgBoundaryBox.value.width.toPrecision(4),
  height: svgBoundaryBox.value.height.toPrecision(4),
})

function handleCopy() {
  copyToClipboard(makeSVG())
}

function handleReset() {
  exportOptions.x = String(viewPortX)
  exportOptions.y = String(viewPortY)
  exportOptions.width = String(viewPortWidth)
  exportOptions.height = String(viewPortHeight)
}

function makeSVG(): string {
  const { x, y, width, height, strokeColor, isStroke, strokeWidth, isFill, fillColor } = exportOptions
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${x} ${y} ${width} ${height}"><path d="${rawPath.value}"${isStroke ? ` stroke="${strokeColor}" stroke-width="${strokeWidth}"` : ''} fill="${isFill ? fillColor : 'none'}" stroke-linecap="round" /></svg>`
}

function copyToClipboard(data: string) {
  navigator.clipboard.writeText(data)
  message.info(
    'Copied to clipboard',
  )
}

function download(fileName: string, data: string) {
  const blob = new Blob([data], { type: 'image/svg+xml' })
  const anchor = document.createElement('a')
  anchor.href = window.URL.createObjectURL(blob)
  anchor.setAttribute('download', fileName)
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()
  document.body.removeChild(anchor)
  setTimeout(() => window.URL.revokeObjectURL(anchor.href), 100)
}

function handleDownload() {
  download('svg-path.svg', makeSVG())
  emits('success')
}

const patternScale = computed(() => svgBoundaryBox.value.width / 300)
</script>

<template>
  <div class="max-w-[800px] w-[80%] rounded bg-[#252526] px-5 py-2 font-mono">
    <h1 class="mb-3 text-xl font-bold">
      Export as SVG
    </h1>

    <n-grid x-gap="12" cols="2 300:1 600:2">
      <n-grid-item>
        <n-grid x-gap="20">
          <n-grid-item span="8">
            <n-checkbox v-model:checked="exportOptions.isFill" label="Fill" />
          </n-grid-item>
          <n-grid-item span="8">
            <n-checkbox v-model:checked="exportOptions.isStroke" label="Stroke" />
          </n-grid-item>
        </n-grid>

        <h2 class="mb-4 text-base text-[#A8A8A8] font-bold">
          Style
        </h2>

        <n-grid class="mb-4" x-gap="12" y-gap="6" cols="1 300:2 400:3">
          <n-grid-item>
            <n-input v-model:value="exportOptions.fillColor" placeholder=" Fill Color" :disabled="!exportOptions.isFill" />
          </n-grid-item>
          <n-grid-item>
            <n-input v-model:value="exportOptions.strokeColor" placeholder="Stroke Color" :disabled="!exportOptions.isStroke" />
          </n-grid-item>
          <n-grid-item>
            <n-input v-model:value="exportOptions.strokeWidth" placeholder="Stroke Color" :disabled="!exportOptions.isStroke" />
          </n-grid-item>
        </n-grid>

        <div class="flex justify-between">
          <h2 class="mb-4 text-base text-[#A8A8A8] font-bold">
            Viewport
          </h2>
          <n-button secondary @click="handleReset">
            重置
          </n-button>
        </div>

        <n-grid class="mb-4" x-gap="12" y-gap="6" cols="1 300:2 400:3">
          <n-grid-item>
            <n-input v-model:value="exportOptions.x" placeholder="X" />
          </n-grid-item>
          <n-grid-item>
            <n-input v-model:value="exportOptions.y" placeholder="Y" />
          </n-grid-item>
          <n-grid-item>
            <n-input v-model:value="exportOptions.width" placeholder="Width" />
          </n-grid-item>
          <n-grid-item>
            <n-input v-model:value="exportOptions.height" placeholder="Height" />
          </n-grid-item>
        </n-grid>
      </n-grid-item>

      <n-grid-item class="flex justify-end">
        <svg
          width="300" height="300" xmlns="http://www.w3.org/2000/svg"
          :viewBox="`${svgBoundaryBox.x} ${svgBoundaryBox.y} ${svgBoundaryBox.width} ${svgBoundaryBox.height}`"
        >
          <defs>
            <pattern
              id="striped-pattern" width="16" height="16" patternUnits="userSpaceOnUse" :patternTransform="`scale(${patternScale})`"
            >
              <rect x="0" y="0" width="16" height="16" fill="white" />
              <rect x="0" y="0" width="8" height="8" fill="#cccccc" />
              <rect x="8" y="8" width="8" height="8" fill="#cccccc" />
            </pattern>
          </defs>
          <clipPath id="preview-clippath">
            <rect :x="svgBoundaryBox.x" :y="svgBoundaryBox.y" :width="svgBoundaryBox.width" :height="svgBoundaryBox.height" />
          </clipPath>

          <rect :x="svgBoundaryBox.x" :y="svgBoundaryBox.y" :width="svgBoundaryBox.width" :height="svgBoundaryBox.height" fill="url(#striped-pattern)" />
          <path :d="rawPath" :fill="exportOptions.fillColor || 'none'" :stroke-width="exportOptions.strokeWidth" :stroke="exportOptions.strokeColor || 'none'" clip-path="url(#preview-clippath)" />

        </svg>
      </n-grid-item>
    </n-grid>

    <div class="mt-6 flex justify-end gap-2">
      <n-button secondary @click="$emit('cancel')">
        取消
      </n-button>
      <n-button secondary @click="handleCopy">
        复制到剪贴板
      </n-button>
      <n-button color="#1e5204" class="text-[#fff]" @click="handleDownload">
        下载
      </n-button>
    </div>
  </div>
</template>

<style scoped>

</style>
