import { defineStore } from 'pinia'
import type { Svg, SvgControlPoint, SvgItem, SvgPoint } from '~/components/svg-edit/core/Svg'

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
  const rawPath = ref<string | undefined>(localStorage.getItem('defaultSvagPath') || DEFAULT_SVG_PATH)
  const hoveredItem = ref<SvgItem | null>(null)
  const foucusedItem = ref<SvgItem | null>(null)
  const draggedPoint = ref<SvgPoint | null>(null)

  const draggedIsNew = ref(false)
  const isDragginng = ref(false)

  const draggedEvent = ref<MouseEvent | TouchEvent | null>(null)
  const wasCanvasDragged = ref(false)

  const coordinateInterval = ref(10)

  const commandList = ref([])

  const targetPoints = ref<SvgPoint[]>([])
  const controlPoints = ref<SvgControlPoint[]>([])

  // for redo and undo
  const changeHistory = ref<string[]>([rawPath.value || ''])
  const currentHistoryIndex = ref(0)

  function addHistoryPath(path: string): void {
    if (!path)
      return

    changeHistory.value.push(path)
    currentHistoryIndex.value = changeHistory.value.length - 1
    localStorage.setItem('defaultSvagPath', path)
  }

  return {
    canvasWidth,
    canvasHeight,
    cfg,
    strokeWidth,
    parsedPath,
    rawPath,
    draggedIsNew,
    isDragginng,
    draggedEvent,
    wasCanvasDragged,
    coordinateInterval,
    commandList,

    hoveredItem,
    foucusedItem,
    draggedPoint,
    targetPoints,
    controlPoints,

    changeHistory,

    currentHistoryIndex,
    addHistoryPath,
  }
})
