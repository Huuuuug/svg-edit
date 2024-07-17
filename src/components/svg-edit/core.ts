import { storeToRefs } from 'pinia'
import { browserComputePathBoundingBox } from './PathCanvas.help'
import type { Point } from './Svg'
import { Svg } from './Svg'
import { useSvgPathStore } from '~/stores/svg-path'

export function useComposition() {
  const { canvasHeight, canvasWidth, rawPath, parsedPath, cfg, strokeWidth, draggedPoint, draggedEvent, wasCanvasDragged, targetPoints, controlPoints }
    = storeToRefs(useSvgPathStore())

  /**
   * Calculates the optimal zoom level for the canvas based on the dimensions of the path bounding box.
   *
   * @return {void} This function does not return anything.
   */
  function zoomAuto(): void {
    const box = browserComputePathBoundingBox(rawPath.value!)
    // 宽高比
    const k = canvasHeight.value / canvasWidth.value

    let w = box.width + 2
    let h = box.height + 2
    if (k < h / w)
      w = h / k
    else
      h = k * w

    updateViewPort(box.x - 1, box.y - 1, w, h)
  }

  /**
   * Updates the view port dimensions based on the provided parameters.
   *
   * @param {number} x - The x-coordinate of the view port.
   * @param {number} y - The y-coordinate of the view port.
   * @param {number | null} w - The width of the view port. Can be null.
   * @param {number | null} h - The height of the view port. Can be null.
   * @param {boolean} _force - A flag to force the update (default: false).
   */
  function updateViewPort(x: number, y: number, w: number | null, h: number | null, _force = false) {
    if (w === null && h !== null)
      w = canvasWidth.value * h / canvasHeight.value
    if (h === null && w !== null)
      h = canvasHeight.value * w / canvasWidth.value

    if (!w || !h)
      return

    cfg.value.viewPortX = Number.parseFloat((1 * x).toPrecision(6))
    cfg.value.viewPortY = Number.parseFloat((1 * y).toPrecision(6))
    cfg.value.viewPortWidth = Number.parseFloat((1 * w).toPrecision(4))
    cfg.value.viewPortHeight = Number.parseFloat((1 * h).toPrecision(4))
    strokeWidth.value = cfg.value.viewPortWidth * 1 / canvasWidth.value
  }

  /**
   * Zooms the view port by a specified scale factor at a given point.
   *
   * @param {WheelEvent} event - The event containing information about the user's interaction with the wheel.
   * @return {void} This function does not return anything.
   */
  function setZoom(event: WheelEvent): void {
    const scale = 1.002 ** event.deltaY
    const pt = eventToLocation(event)
    zoomViewPort(scale, pt)
  }

  /**
   * Zooms the view port by a specified scale factor at a given point.
   *
   * @param {number} scale - The scale factor to apply to the view port.
   * @param {object} pt - The point at which to zoom the view port. Defaults to the center of the view port if not provided.
   * @param {number} pt.x - The x-coordinate of the zoom point.
   * @param {number} pt.y - The y-coordinate of the zoom point.
   * @return {void} This function does not return anything.
   */
  function zoomViewPort(scale: number, pt?: { x: number, y: number }): void {
    if (!pt)
      pt = { x: cfg.value.viewPortX + 0.5 * cfg.value.viewPortWidth, y: cfg.value.viewPortY + 0.5 * cfg.value.viewPortHeight }

    const x = cfg.value.viewPortX + ((pt.x - cfg.value.viewPortX) - scale * (pt.x - cfg.value.viewPortX))
    const y = cfg.value.viewPortY + ((pt.y - cfg.value.viewPortY) - scale * (pt.y - cfg.value.viewPortY))
    const w = scale * cfg.value.viewPortWidth
    const h = scale * cfg.value.viewPortHeight
    updateViewPort(x, y, w, h)
  }

  /**
   * Converts an event to a location on the canvas.
   *
   * @param {WheelEvent | TouchEvent} event - The event to convert to a location.
   * @param {number} [_idx] - The index parameter (default: 0).
   * @return {{ x: number, y: number }} The x and y coordinates of the location.
   */
  function eventToLocation(event: MouseEvent | TouchEvent, _idx: number = 0): { x: number, y: number } {
    const canvas = document.getElementById('canvas')
    const { top, left } = useElementBounding(canvas)
    const touch = event instanceof MouseEvent ? event : event.touches[0]
    const x = cfg.value.viewPortX + (touch.clientX - left.value) * strokeWidth.value
    const y = cfg.value.viewPortY + (touch.clientY - top.value) * strokeWidth.value
    return { x, y }
  }

  function drag(event: MouseEvent | TouchEvent) {
    // 计算当前鼠标的位置
    const pt = eventToLocation(event)
    if (draggedPoint.value && parsedPath.value) {
      parsedPath.value.setLocation(draggedPoint.value, pt as Point)
      reloadPoints()
    }
    else if (draggedEvent.value) {
      // 拖拽画布
      wasCanvasDragged.value = true
      const oriPt = eventToLocation(draggedEvent.value)
      const x = cfg.value.viewPortX + (oriPt.x - pt.x)
      const y = cfg.value.viewPortY + (oriPt.y - pt.y)
      const w = cfg.value.viewPortWidth
      const h = cfg.value.viewPortHeight

      updateViewPort(x, y, w, h)
    }
    draggedEvent.value = event
  }

  /**
   * A function to stop the drag operation.
   *
   */
  function stopDrag() {
    draggedEvent.value = null
    draggedPoint.value = null
    wasCanvasDragged.value = false
  }

  function reloadPath(newPath: string, autozoom: boolean = false) {
    try {
      rawPath.value = newPath
      parsedPath.value = new Svg(rawPath.value)

      reloadPoints()
      if (autozoom)
        zoomAuto()
    }
    catch (e) {
      if (!parsedPath.value)
        parsedPath.value = new Svg('')
    }
  }

  function reloadPoints() {
    targetPoints.value = parsedPath.value?.targetLocations()
    controlPoints.value = parsedPath.value?.controlLocations()
  }

  return { zoomAuto, setZoom, drag, stopDrag, reloadPath }
}
