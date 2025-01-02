<script setup lang='ts'>
import type { DropdownOption } from 'naive-ui'
import type { SvgItem } from '../core/Svg'
import { storeToRefs } from 'pinia'
import { useSvgPathStore } from '~/stores/svg-path'

const props = withDefaults(defineProps<{
  disableDelete?: boolean
}>(), {
  disableDelete: false,
})

const emits = defineEmits<{
  (e: 'operate', type: string): void
}>()

const { focusedItem, parsedPath } = storeToRefs(useSvgPathStore())

const isOperateModalVisible = ref(false)

const svgItemMap = [
  {
    key: 'M',
    label: 'Move to',
    icon: () => h('H', { class: 'font-bold' }, 'M'),
  },
  {
    key: 'L',
    label: 'Line to',
    icon: () => h('H', { class: 'font-bold' }, 'L'),
  },
  {
    key: 'V',
    label: 'Vertical line to',
    icon: () => h('H', { class: 'font-bold' }, 'V'),
  },
  {
    key: 'H',
    label: 'Horizontal line to',
    icon: () => h('H', { class: 'font-bold' }, 'H'),

  },
  {
    key: 'C',
    label: 'Curve to',
    icon: () => h('H', { class: 'font-bold' }, 'C'),

  },
  {
    key: 'S',
    label: 'Shorthand curve to',
    icon: () => h('H', { class: 'font-bold' }, 'S'),

  },
  {
    key: 'Q',
    label: 'Quadratic Bezier curve to',
    icon: () => h('H', { class: 'font-bold' }, 'Q'),

  },
  {
    key: 'T',
    label: 'Shorthand Quadratic Bezier curve to',
    icon: () => h('H', { class: 'font-bold' }, 'T'),

  },
  {
    key: 'A',
    label: 'Elliptical arc to',
    icon: () => h('H', { class: 'font-bold' }, 'A'),

  },
  {
    key: 'Z',
    label: 'Close path',
    icon: () => h('H', { class: 'font-bold' }, 'Z'),

  },
]

const operations = computed<DropdownOption[]>(() => [
  {
    key: 'insert',
    label: 'Insert After',
    icon: () => h('i', { class: 'i-material-symbols:add' }),
    children: svgItemMap.map(it => ({
      ...it,
      disabled: !canInsertAfter(focusedItem.value, it.key),
    })),
  },
  // {
  //   key: 'Convert',
  //   label: 'Convert To',
  // },
  // {
  //   key: 'relative',
  //   label: 'Set Relative',
  // },
  {
    key: 'delete',
    label: 'Delete',
    icon: () => h('i', { class: 'i-carbon:trash-can' }),
    disabled: props.disableDelete,
  },
])

function onRecommendSelected(key: string) {
  emits('operate', key)
  isOperateModalVisible.value = false
}

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
</script>

<template>
  <n-dropdown
    placement="bottom-start"
    :options="operations"
    :show="isOperateModalVisible"
    :on-clickoutside="() => isOperateModalVisible = false"
    :on-select="onRecommendSelected"
  >
    <div class="h-4 w-[4px] w-4 flex items-center justify-center rounded-full hover:bg-[#135200]" @click="isOperateModalVisible = true">
      <div class="cursor-pointer" i="carbon-overflow-menu-horizontal" />
    </div>
  </n-dropdown>
</template>

<style scoped>
</style>
