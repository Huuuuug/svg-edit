import { defineStore } from 'pinia'

// const DEFAULT_SVG_PATH = 'M30 15h-2.05A12.007 12.007 0 0 0 17 4.05V2h-2v2.05A12.007 12.007 0 0 0 4.05 15H2v2h2.05A12.007 12.007 0 0 0 15 27.95V30h2v-2.05A12.007 12.007 0 0 0 27.95 17H30ZM17 25.95V22h-2v3.95A10.017 10.017 0 0 1 6.05 17H10v-2H6.05A10.017 10.017 0 0 1 15 6.05V10h2V6.05A10.017 10.017 0 0 1 25.95 15H22v2h3.95A10.017 10.017 0 0 1 17 25.95Z'
const DEFAULT_SVG_PATH = 'M 4 8 L 10 1 L 13 0 L 12 3 L 5 9 C 6 10 6 11 7 10 C 7 11 8 12 7 12 A 1.42 1.42 0 0 1 6 13 A 5 5 0 0 0 4 10 Q 3.5 9.9 3.5 10.5 T 2 11.8 T 1.2 11 T 2.5 9.5 T 3 9 A 5 5 90 0 0 0 7 A 1.42 1.42 0 0 1 1 6 C 1 5 2 6 3 6 C 2 7 3 7 4 8 M 10 1 L 10 3 L 12 3 L 10.2 2.8 L 10 1'

export const useSvgPathStore = defineStore('svgPathStore', () => {
  const canvasWidth = ref(100)
  const canvasHeight = ref(100)
  const cfg = reactive({
    viewPortX: 0,
    viewPortY: 0,
    viewPortWidth: 0,
    viewPortHeight: 0,
    strokeWidth: 0,
  })
  const strokeWidth = ref(0)
  const parsedPath = ref()
  const rawPath = ref(DEFAULT_SVG_PATH)

  const draggedEvent = ref<MouseEvent | TouchEvent | null>(null)
  const wasCanvasDragged = ref(false) // 画布是否被拖拽
  return {
    canvasWidth,
    canvasHeight,
    cfg,
    strokeWidth,
    parsedPath,
    rawPath,
    draggedEvent,
    wasCanvasDragged,
  }
})
