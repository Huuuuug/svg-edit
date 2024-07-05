<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useSvgPathStore } from '~/stores/svg-path'

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

const { coordinateInterval } = storeToRefs(useSvgPathStore())
const parsedPath = computed(() => {
  if (props.parsedPath)
    return (props.parsedPath as any).asString()
  else
    return ''
})

const xGrid = ref()
const yGrid = ref()
const symbolFn = (key: string) => Symbol(key)

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

    <path
      v-show="isPlay === 'stop'"
      id="mainSvg"
      :stroke-width="strokeWidth"
      stroke="currentColor"
      fill="#ffffff60"
      :d="parsedPath"
    />

    <template v-for="x in xGrid" :key="x">
      <text
        v-if="x % coordinateInterval === 0 "
        class="select-none"
        :style="{ fontSize: `${strokeWidth * 14}px`, fill: '#595959' }"
        :x="x - 18 * strokeWidth"
        :y="-6 * strokeWidth"
      >{{ x }}
      </text>
    </template>

    <template v-for="y in yGrid" :key="y">
      <text
        v-if="y % coordinateInterval === 0 && y !== 0"
        class="select-none"
        :style="{ fontSize: `${strokeWidth * 14}px`, fill: '#595959' }"
        :x="-20 * strokeWidth"
        :y="y - 6 * strokeWidth"
      >
        {{ y }}
      </text>
    </template>

  </svg>
</template>

<style scoped>
</style>
