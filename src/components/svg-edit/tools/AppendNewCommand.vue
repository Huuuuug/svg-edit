<script setup lang='ts'>
import type { DropdownOption } from 'naive-ui'
import { storeToRefs } from 'pinia'
import type { SvgItem } from '../core/Svg'
import { useComposition } from '~/components/svg-edit/core/composition'
import { useSvgPathStore } from '~/stores/svg-path'

const { insert } = useComposition()
const { foucusedItem, parsedPath } = storeToRefs(useSvgPathStore())

const isOperateModalVisible = ref(false)

const isMouseIn = ref(false)

const isToolTipVisible = computed(() => isMouseIn.value && !isOperateModalVisible.value)

function canInsertAfter(item: SvgItem | null, type: string): boolean {
  let previousType: string | null = null
  if (item !== null) {
    previousType = item.getType().toUpperCase()
  }
  else if (parsedPath.value && parsedPath.value.path.length < 0) {
    previousType = parsedPath.value.path[parsedPath.value.path.length - 1].getType().toUpperCase()
  }
  if (!previousType) {
    return type !== 'Z'
  }
  if (previousType === 'M') {
    return type !== 'M' && type !== 'Z' && type !== 'T' && type !== 'S'
  }
  if (previousType === 'Z') {
    return type !== 'Z' && type !== 'T' && type !== 'S'
  }
  if (previousType === 'C' || previousType === 'S') {
    return type !== 'T'
  }
  if (previousType === 'Q' || previousType === 'T') {
    return type !== 'S'
  }
  return type !== 'T' && type !== 'S'
}

const operations = computed<DropdownOption[]>(() => {
  const svgItem = [
    {
      key: 'M',
      label: 'Move to',
    },
    {
      key: 'L',
      label: 'Line to',
    },
    {
      key: 'V',
      label: 'Vertical line to',
    },
    {
      key: 'H',
      label: 'Horizontal line to',
    },
    {
      key: 'C',
      label: 'Curve to',
    },
    {
      key: 'S',
      label: 'Shorthand curve to',
    },
    {
      key: 'Q',
      label: 'Quadratic Bezier curve to',
    },
    {
      key: 'T',
      label: 'Shorthand Quadratic Bezier curve to',
    },
    {
      key: 'A',
      label: 'Elliptical arc to',
    },
    {
      key: 'Z',
      label: 'Close path',
    },
  ]
  return svgItem.map(it => ({
    ...it,
    disabled: !canInsertAfter(foucusedItem.value, it.key),
  }))
},
)

function renderDropsdownIcon(option: DropdownOption) {
  return h('H', { class: 'font-bold' }, option.key)
}

function onDropDownItemSelect(key: string, _option: DropdownOption) {
  isOperateModalVisible.value = false
  insert(key, foucusedItem.value)
}
</script>

<template>
  <n-dropdown
    placement="bottom-start"
    :options="operations"
    :show="isOperateModalVisible"
    :render-icon="renderDropsdownIcon"
    :on-clickoutside="() => isOperateModalVisible = false"
    :on-select="onDropDownItemSelect"
  >
    <n-tooltip placement="bottom" :show-arrow="false" :show="isToolTipVisible" trigger="manual" :style="{ padding: '4px 6px' }">
      <template #trigger>
        <button
          class="h-10 w-10 rounded-full bg-[#135200] hover:bg-[#237804]"
          @mouseenter="isMouseIn = true"
          @mouseleave="isMouseIn = false"
          @click="isOperateModalVisible = true"
        >
          <div class="i-material-symbols:add h-6 w-6" />
        </button>
      </template>
      Append new command
    </n-tooltip>
  </n-dropdown>
</template>

<style scoped>
</style>
