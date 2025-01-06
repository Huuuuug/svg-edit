import type { Svg, SvgControlPoint, SvgItem, SvgPoint } from '~/components/svg-edit/core/Svg'
import { defineStore } from 'pinia'

const DEFAULT_SVG_PATH = 'M 0 0 L 10 10 L 10 5 H 20 V 0 C 10 -10 5 -15 0 0'

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

  const parsedPath = ref<Svg>()
  const rawPath = ref<string | undefined>(localStorage.getItem('defaultSvgPath') || DEFAULT_SVG_PATH)
  const hoveredItem = ref<SvgItem | null>(null)
  const focusedItem = ref<SvgItem | null>(null)
  const draggedPoint = ref<SvgPoint | null>(null)

  const draggedIsNew = ref(false)
  const isDragging = ref(false)

  const isCanvasLocked = ref(false)

  const draggedEvent = ref<MouseEvent | TouchEvent | null>(null)
  const wasCanvasDragged = ref(false)

  const isShowTick = ref(true)
  const coordinateInterval = ref(10)

  const commandList = ref([])

  const targetPoints = ref<SvgPoint[]>([])
  const controlPoints = ref<SvgControlPoint[]>([])

  // 坐标保留小数点个数
  const decimals = ref<number>(3)
  const isSnap = ref(true)

  const isFill = ref(true)
  const isPreview = ref(false)

  // svg压缩
  const isMinify = ref(false)

  // for redo and undo
  const changeHistory = ref<string[]>([rawPath.value || ''])
  const currentHistoryIndex = ref(0)

  function addHistoryPath(path: string): void {
    if (!path)
      return

    changeHistory.value.push(path)
    currentHistoryIndex.value = changeHistory.value.length - 1
    localStorage.setItem('defaultSvgPath', path)
  }

  return {
    isMinify,
    isSnap,
    canvasWidth,
    canvasHeight,
    cfg,
    strokeWidth,
    parsedPath,
    rawPath,
    draggedIsNew,
    isDragging,
    isCanvasLocked,
    draggedEvent,
    wasCanvasDragged,
    isShowTick,
    coordinateInterval,
    commandList,
    decimals,
    isFill,
    hoveredItem,
    focusedItem,
    draggedPoint,
    targetPoints,
    controlPoints,
    isPreview,
    changeHistory,

    currentHistoryIndex,
    addHistoryPath,
  }
})
