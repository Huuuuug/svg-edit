import { storeToRefs } from 'pinia'
import { useComposition } from '../core/composition'
import { useSvgPathStore } from '~/stores/svg-path'

export function initCanvas() {
  const { zoomAuto } = useComposition()
  const { canvasHeight, canvasWidth } = storeToRefs(useSvgPathStore())
  const { clientWidth: width, clientHeight: height } = document.getElementById('canvas') as HTMLElement

  canvasWidth.value = width
  canvasHeight.value = height
  zoomAuto()
}

/**
 * Initializes event listeners for the canvas element.
 *
 * Sets up event listeners for wheel, mousedown, mouseup, and mousemove events.
 * These listeners handle zooming, dragging, and stopping drag operations.
 *
 * @return {void}
 */
export function initEventListener(): void {
  const canvas = document.getElementById('canvas') as HTMLElement
  const { setZoom, drag, stopDrag } = useComposition()
  const { draggedEvent, draggedPoint, wasCanvasDragged, draggedIsNew } = storeToRefs(useSvgPathStore())
  useEventListener(canvas, 'wheel', (event: WheelEvent) => {
    event.preventDefault()
    setZoom(event)
  })
  useEventListener(canvas, 'mousedown', (event: MouseEvent) => {
    draggedEvent.value = event
    wasCanvasDragged.value = false
    draggedIsNew.value = false
  })
  useEventListener(canvas, 'mouseup', (_event: MouseEvent) => {
    stopDrag()
  })
  useEventListener(canvas, 'mousemove', (event: MouseEvent) => {
    // 鼠标左键点击
    if (event.buttons === 1 || draggedPoint.value)
      drag(event)
  })
}

/**
 * Initializes the SVG path based on the stored raw path.
 *
 * If the raw path is not empty, it is used to reload the SVG path.
 * If the raw path is empty, an empty path is created.
 *
 * @return {void}
 */
export function initSvgPath(): void {
  const { rawPath } = storeToRefs(useSvgPathStore())
  const { reloadPath } = useComposition()
  reloadPath(rawPath.value!, true)
}
