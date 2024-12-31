import { storeToRefs } from 'pinia'
import { useSvgPathStore } from '~/stores/svg-path'

export function useOperateToolPanel() {
  const { changeHistory, currentHistoryIndex, rawPath, focusedItem, hoveredItem } = storeToRefs(useSvgPathStore())

  /**
   * Undo function that reverts the changes made to the raw path.
   *
   * @return {void} No return value
   */
  function undo(): void {
    if (currentHistoryIndex.value <= -1)
      return
    focusedItem.value = null
    hoveredItem.value = null
    currentHistoryIndex.value--
    rawPath.value = changeHistory.value[currentHistoryIndex.value]
    localStorage.setItem('defaultSvgPath', rawPath.value)
  }

  /**
   * Redo function that reapplies the changes made to the raw path.
   *
   * @return {void} No return value
   */
  function redo(): void {
    if (currentHistoryIndex.value >= changeHistory.value.length - 1)
      return
    focusedItem.value = null
    hoveredItem.value = null
    currentHistoryIndex.value++
    rawPath.value = changeHistory.value[currentHistoryIndex.value]
    localStorage.setItem('defaultSvgPath', rawPath.value)
  }

  return { undo, redo }
}
