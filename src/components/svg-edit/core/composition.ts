import { storeToRefs } from 'pinia'
import { browserComputePathBoundingBox } from '../canvas/PathCanvas.help'
import { Point, Svg, SvgItem } from './Svg'
import { useSvgPathStore } from '~/stores/svg-path'

export function useComposition() {
  const { canvasHeight, canvasWidth, rawPath, parsedPath, cfg, strokeWidth, draggedPoint, draggedIsNew, draggedEvent, foucusedItem, wasCanvasDragged, targetPoints, controlPoints }
    = storeToRefs(useSvgPathStore())

  const { addHistoryPath } = useSvgPathStore()

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
   * @param  _force - A flag to force the update (default: false).
   */
  function updateViewPort(x: number, y: number, w: number | null, h: number | null, _force = false): void {
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
   * Inserts a new item into the path after the provided item.
   * If after is null, the new item is inserted at the start of the path.
   * The new item is created using the provided type and the last
   * control point of the path.
   * @param {string} type - The type of the new item. Can be 'M', 'L', 'H', 'V', 'C', 'S', 'Q', 'T', 'A', or 'Z'.
   * @param {SvgItem | null} after - The item after which the new item is inserted. Can be null.
   * @param {boolean} _convert - Whether to convert the new item's coordinates to absolute.
   * @return {void}
   */
  function insert(type: string, after?: SvgItem | null, _convert?: boolean): void {
    let newItem: SvgItem | null = null
    let point1: Point

    draggedIsNew.value = true
    const pts = targetPoints.value

    if (after) {
      point1 = after.targetLocation()
    }
    else if (pts.length === 0) {
      newItem = SvgItem.Make(['M', '0', '0'])
      parsedPath.value?.insert(newItem)
      point1 = new Point(0, 0)
    }
    else {
      point1 = pts[pts.length - 1]
    }

    if (type.toLowerCase() !== 'm' || !newItem) {
      const relative = type.toLowerCase() === type
      const X = (relative ? 0 : point1.x).toString()
      const Y = (relative ? 0 : point1.y).toString()

      switch (type.toLocaleLowerCase()) {
        case 'm': case 'l': case 't':
          newItem = SvgItem.Make([type, X, Y])
          break
        case 'h':
          newItem = SvgItem.Make([type, X])
          break
        case 'v':
          newItem = SvgItem.Make([type, Y])
          break
        case 's': case 'q':
          newItem = SvgItem.Make([type, X, Y, X, Y])
          break
        case 'c':
          newItem = SvgItem.Make([type, X, Y, X, Y, X, Y])
          break
        case 'a':
          newItem = SvgItem.Make([type, '1', '1', '0', '0', '0', X, Y])
          break
        case 'z':
          newItem = SvgItem.Make([type])
      }
      if (newItem) {
        parsedPath.value?.insert(newItem, after ?? undefined)
      }
    }

    if (newItem) {
      foucusedItem.value = newItem
      draggedPoint.value = newItem.targetLocation()
    }
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

  /**
   * Handles the drag event.
   *
   * @param {MouseEvent | TouchEvent} event - The drag event.
   * @return {void} This function does not return anything.
   */
  function drag(event: MouseEvent | TouchEvent): void {
    // 计算当前鼠标的位置
    const pt = eventToLocation(event)
    if (draggedPoint.value && parsedPath.value) {
      parsedPath.value.setLocation(draggedPoint.value, pt as Point)
      if (draggedIsNew.value) {
        const previousIdx = parsedPath.value.path.indexOf(draggedPoint.value.itemReference) - 1
        if (previousIdx >= 0) {
          draggedPoint.value.itemReference.resetControlPoints(parsedPath.value.path[previousIdx])
        }
      }
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
    if (draggedPoint.value && rawPath.value) {
      draggedEvent.value = null
      draggedPoint.value = null
      addHistoryPath(rawPath.value)
    }

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
    catch {
      if (!parsedPath.value)
        parsedPath.value = new Svg('')
    }
  }

  function reloadPoints() {
    if (!parsedPath.value)
      return
    targetPoints.value = parsedPath.value.targetLocations()
    controlPoints.value = parsedPath.value.controlLocations()
  }

  return { zoomAuto, setZoom, drag, stopDrag, reloadPath, zoomViewPort, insert }
}
