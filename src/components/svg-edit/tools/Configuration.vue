<script lang="ts" setup>
import { storeToRefs } from 'pinia'
import { useSvgPathStore } from '~/stores/svg-path'

const { cfg, isCanvasLocked } = storeToRefs(useSvgPathStore())

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
</script>

<template>
  <div class="w-full flex gap-[3px] p-[1px]">
    <template v-for="conf in canvasConf" :key="conf.label">
      <div class="relative box-border h-[32px] w-[21%] flex flex-col justify-end rounded-t-[2px] bg-[#454545]">
        <label class="absolute left-[3px] top-0 text-[8px] color-[#c8c8c8]" :for="conf.label">{{ conf.label }}</label>
        <input :id="conf.label" :value="parseFloat(conf.value.toFixed(4)).toString()" type="text" :disabled="isCanvasLocked" class="h-[65%] w-full border-b-[2px] bg-[#454545] px-[3px] outline-none" :class="isCanvasLocked ? `opacity-30` : `focus:border-[#00AEFF] hover:border-[#f5f6fa] `">
      </div>
    </template>

    <button class="flex-1 rounded-[5px] bg-[#454545]" @click="isCanvasLocked = !isCanvasLocked">
      <div :class="isCanvasLocked ? 'i-material-symbols:lock' : 'i-ic:baseline-lock-open'" class="text-[19px]" />
    </button>
  </div>
</template>
