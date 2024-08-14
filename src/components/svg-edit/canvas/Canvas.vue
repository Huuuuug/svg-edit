<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import type { SvgPoint } from '../core/Svg'
import { useSvgPathStore } from '~/stores/svg-path'
import { symbolFn } from '~/utils'

const props = defineProps({
  viewPortX: {
    type: Number,
    default: 0,
  },
  viewPortY: {
    type: Number,
    default: 0,
  },
  viewPortWidth: {
    type: Number,
    default: 0,
  },
  viewPortHeight: {
    type: Number,
    default: 0,
  },
  strokeWidth: {
    type: Number,
    default: 1,
  },
  canvasWidth: {
    type: Number,
    default: 100,
  },
  canvasHeight: {
    type: Number,
    default: 100,
  },
  parsedPath: {
    type: Object,
    default: () => null,
  },
  isPlay: {
    type: String,
    default: 'stop',
  },
})

const { coordinateInterval, foucusedItem, hoveredItem, targetPoints, controlPoints, draggedPoint } = storeToRefs(useSvgPathStore())
const parsedPath = computed(() => {
  if (props.parsedPath) {
    return (props.parsedPath as any).asString()
  }

  else {
    return ''
  }
})

const xGrid = ref()
const yGrid = ref()

watch(props, () => {
  if (5 * props.viewPortWidth <= props.canvasWidth) {
    xGrid.value = Array(Math.ceil(props.viewPortWidth) + 1).fill(null).map((_, i) => Math.floor(props.viewPortX) + i)
    yGrid.value = Array(Math.ceil(props.viewPortHeight) + 1).fill(null).map((_, i) => Math.floor(props.viewPortY) + i)
  }
  else {
    xGrid.value = []
    yGrid.value = []
  }
}, { immediate: true })

function startDrag(item: SvgPoint, e: MouseEvent) {
  if (e.buttons === 1) {
    foucusedItem.value = item.itemReference
    draggedPoint.value = item
  }
}
</script>

<template>
  <svg class="bg-transparent" width="100%" height="100%" :viewBox="`${viewPortX} ${viewPortY} ${viewPortWidth} ${viewPortHeight}`">
    <!-- 背景网格 -->
    <line
      :x1="props.viewPortX"
      y1="0"
      :x2="props.viewPortX + props.viewPortWidth"
      y2="0"
      stroke="#40404180"
      fill="transparent"
      :stroke-width="strokeWidth * 4"
    />

    <line
      :x1="0"
      :y1="props.viewPortY"
      :x2="0"
      :y2="props.viewPortY + props.viewPortHeight"
      stroke="#40404180"
      fill="transparent"
      :stroke-width="strokeWidth * 4"
    />

    <line
      v-for="item in xGrid"
      :key="symbolFn(item)"
      :x1="item"
      :y1="props.viewPortY"
      :x2="item"
      :y2="props.viewPortY + props.viewPortHeight"
      stroke="#353536"
      fill="transparent"
      :stroke-width="(item !== 0 && item % coordinateInterval === 0) ? strokeWidth * 3 : strokeWidth"
    />

    <line
      v-for="item in yGrid"
      :key="symbolFn(item)"
      :x1="props.viewPortX"
      :y1="item"
      :x2="props.viewPortX + props.viewPortWidth"
      :y2="item"
      stroke="#353536"
      fill="transparent"
      :stroke-width="(item !== 0 && item % coordinateInterval === 0) ? strokeWidth * 3 : strokeWidth"
    />

    <!-- coordinate line -->
    <template v-for="x in xGrid" :key="x">
      <text
        v-if="x % coordinateInterval === 0 "
        class="select-none"
        :style="{ fontSize: `${strokeWidth * 12}px`, fill: '#595959' }"
        :x="x - 18 * strokeWidth"
        :y="-6 * strokeWidth"
      >{{ x }}
      </text>
    </template>

    <template v-for="y in yGrid" :key="y">
      <text
        v-if="y % coordinateInterval === 0 && y !== 0"
        class="select-none"
        :style="{ fontSize: `${strokeWidth * 12}px`, fill: '#595959' }"
        :x="-20 * strokeWidth"
        :y="y - 6 * strokeWidth"
      >
        {{ y }}
      </text>
    </template>

    <!-- full path -->
    <path
      id="mainSvg"
      :stroke-width="strokeWidth"
      stroke="#fff"
      fill="#ffffff60"
      :d="parsedPath"
    />
    <!-- hoverPath -->
    <path
      v-if="hoveredItem"
      id="focusSvg"
      :stroke-width="strokeWidth"
      fill="transparent"
      stroke="#FF0033"
      :d="hoveredItem.asStandaloneString()"
    />
    <!-- focusPath -->
    <path
      v-if="foucusedItem"
      id="focusSvg"
      :stroke-width="strokeWidth"
      fill="transparent"
      stroke="#00AEFF"
      :d="foucusedItem.asStandaloneString()"
    />

    <!-- control point -->
    <g v-for="item in controlPoints" :key="symbolFn(item)">
      <circle
        class="z1 cursor-pointer"
        :cx="item.x"
        :cy="item.y"
        fill="gray"
        :r="strokeWidth"
        :stroke="foucusedItem === item.itemReference ? '#00AEFF' : hoveredItem === item.itemReference ? '#FF0033' : 'gray'"
        :stroke-width="strokeWidth * 5"
        @mousedown="(e:MouseEvent) => startDrag(item, e)"
        @mouseenter="hoveredItem = item.itemReference"
        @mouseleave="hoveredItem = null"
      />
      <line
        v-for="rel in item.relations"
        :key="symbolFn(rel)"
        class="z0"
        :x1="item.x"
        :y1="item.y"
        :x2="rel.x"
        :y2="rel.y"
        :stroke-width="strokeWidth"
        stroke="gray"
      />
    </g>

    <!-- target point -->
    <template v-for="item in targetPoints" :key="symbolFn(item)">
      <circle
        class="z1 cursor-pointer"
        :cx="item.x"
        :cy="item.y"
        fill="#fff"
        :r="strokeWidth"
        stroke="#fff"
        :stroke-width="strokeWidth * 5"
        @mousedown="(e:MouseEvent) => startDrag(item, e)"
        @mouseenter="hoveredItem = item.itemReference"
        @mouseleave="hoveredItem = null"
      />
    </template>

  </svg>
</template>

<style scoped>
</style>
