<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSvgPathStore } from '~/stores/svg-path'

const { cfg, isCanvasLocked, isSnap, isShowTick, decimals, coordinateInterval, isFill, isPreview, isMinify, rawPath, parsedPath } = storeToRefs(useSvgPathStore())

const canvasConf = computed(() => ([
  {
    label: 'X',
    value: cfg.value.viewPortX,
  },
  {
    label: 'Y',
    value: cfg.value.viewPortY,
  },
  {
    label: 'Width',
    value: cfg.value.viewPortWidth,
  },
  {
    label: 'Height',
    value: cfg.value.viewPortHeight,
  },
]))

watch(() => isMinify.value, () => {
  rawPath.value = parsedPath.value?.asString(decimals.value, isMinify.value)
})
</script>

<template>
  <div class="w-full flex gap-[3px] p-[1px]">
    <template v-for="conf in canvasConf" :key="conf.label">
      <div class="relative box-border h-[32px] w-[21%] flex flex-col justify-end rounded-t-[2px] bg-[#454545]">
        <label class="absolute left-[3px] top-0 text-[8px] color-[#c8c8c8]" :class="isCanvasLocked ? `opacity-30` : ``" :for="conf.label">{{ conf.label }}</label>
        <input :id="conf.label" :value="parseFloat(conf.value.toFixed(4)).toString()" type="text" :disabled="isCanvasLocked" class="h-[65%] w-full border-b-[2px] bg-[#454545] px-[3px] outline-none" :class="isCanvasLocked ? `opacity-30` : `focus:border-[#00AEFF] hover:border-[#f5f6fa]`">
      </div>
    </template>

    <button class="flex-1 rounded-[5px] bg-[#454545]" @click="isCanvasLocked = !isCanvasLocked">
      <div :class="isCanvasLocked ? 'i-material-symbols:lock' : 'i-ic:baseline-lock-open'" class="text-[19px]" />
    </button>
  </div>

  <div class="mx-[1px] my-[4px] flex items-center justify-between">
    <n-checkbox v-model:checked="isSnap" size="large" :focusable="false">
      Snap to Grid
    </n-checkbox>

    <div class="relative h-[36px] flex flex-col justify-end rounded-t-[2px] bg-[#454545]">
      <label for="decimals" class="absolute left-[3px] top-0 text-[10px]" :class="isSnap ? `opacity-30` : ``">Point Precision</label>
      <input id="decimals" v-model="decimals" type="text" class="h-[65%] w-full border-b-[2px] bg-[#454545] px-[3px] outline-none" :class="isSnap ? `opacity-30` : `focus:border-[#00AEFF] hover:border-[#f5f6fa]`">
    </div>
  </div>

  <div class="mx-[1px] my-[4px] flex items-center justify-between">
    <n-checkbox v-model:checked="isShowTick" size="large" :focusable="false">
      Show Ticks
    </n-checkbox>

    <div class="relative h-[36px] flex flex-col justify-end rounded-t-[2px] bg-[#454545]">
      <label for="interval" class="absolute left-[3px] top-0 text-[10px]" :class="!isShowTick ? `opacity-30` : ``">Interval</label>
      <input id="interval" v-model="coordinateInterval" type="text" :disabled="!isShowTick" :class="!isShowTick ? `opacity-30` : `focus:border-[#00AEFF] hover:border-[#f5f6fa]`" class="h-[65%] w-full border-b-[2px] bg-[#454545] px-[3px] outline-none">
    </div>
  </div>

  <div class="flex justify-between">
    <n-checkbox v-model:checked="isFill" size="large" :focusable="false">
      Fill
    </n-checkbox>
    <n-checkbox v-model:checked="isPreview" size="large" :focusable="false">
      Preview
    </n-checkbox>
    <n-checkbox v-model:checked="isMinify" size="large" :focusable="false">
      Minify output
    </n-checkbox>
  </div>
</template>
