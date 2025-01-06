<script setup lang='ts'>
import type { SvgItem } from '../core/Svg'
import { storeToRefs } from 'pinia'
import { useSvgPathStore } from '~/stores/svg-path'
import { useComposition } from '../core/composition'
import AppendNewCommand from './AppendNewCommand.vue'
import Configuration from './Configuration.vue'

const { rawPath, parsedPath, hoveredItem, focusedItem, isMinify, decimals } = storeToRefs(useSvgPathStore())
const { reloadPath, insert, zoomAuto } = useComposition()

const defaultExpandedNames = ref(['path', 'commands', 'configuration'])

function updateCommandValue(e: any, item: SvgItem, idx: number) {
  const val = Number((e.target as any)?.value)
  if (!Number.isNaN(val)) {
    item.values[idx] = Number(val)
    parsedPath.value!.refreshAbsolutePositions()
    rawPath.value = parsedPath.value?.asString(decimals.value, isMinify.value)
  }
}

function handleClearPath() {
  focusedItem.value = null
  reloadPath('', false)
}

function onClickOperate(type: string, item: SvgItem) {
  if (type === 'delete') {
    if (parsedPath.value?.path.indexOf(item) !== -1) {
      parsedPath.value?.delete(item)
      if (item === focusedItem.value)
        focusedItem.value = null
    }
  }
  else {
    insert(type, focusedItem.value)
  }
}

function onEllipticalArcChange(parsedPathIdx: number, pathIdx: number) {
  if (!parsedPath.value)
    return
  parsedPath.value.path[parsedPathIdx].values[pathIdx] = parsedPath.value.path[parsedPathIdx].values[pathIdx] === 0 ? 1 : 0
}

watch(() => parsedPath.value?.path, () => {
  rawPath.value = parsedPath.value?.asString(decimals.value, isMinify.value)
}, { deep: true })

const isPanelVisible = ref(true)

function onPanelSwitch() {
  isPanelVisible.value = !isPanelVisible.value
  zoomAuto()
}
</script>

<template>
  <div class="relative h-full">
    <div class="trapezoid absolute" @click="onPanelSwitch" />
    <transition name="transition-fade">
      <div v-if="isPanelVisible" class="h-full w-[320px] bg-[#252526] p-1">
        <n-collapse arrow-placement="right" :default-expanded-names="defaultExpandedNames">
          <n-collapse-item title="PATH" name="path">
            <n-input
              v-model:value="rawPath"
              class="text-left"
              type="textarea"
              placeholder="Paste path here"
              :rows="4"
            />
            <div class="flex justify-between p-1">
              <n-tooltip placement="bottom" :show-arrow="false" trigger="hover" :style="{ padding: '4px 6px' }">
                <template #trigger>
                  <button class="h-10 w-10 rounded-full bg-[#424242] hover:bg-[#545454]" @click="handleClearPath">
                    <div class="i-material-symbols:close-rounded h-6 w-6" />
                  </button>
                </template>
                Clear path
              </n-tooltip>

              <AppendNewCommand />
            </div>
          </n-collapse-item>
          <n-collapse-item title="CONFIGURATION" name="configuration">
            <Configuration />
          </n-collapse-item>
          <n-collapse-item title="COMMANDS" name="commands">
            <template v-for="item, idx in parsedPath?.path" :key="item">
              <div
                class="w-full flex flex-row items-center justify-between"
                :class="{ 'bg-[#3B3B3C70]': hoveredItem === item && focusedItem !== item, 'bg-[#2C978030]': focusedItem === item }"
                @mouseenter="hoveredItem = item"
                @mouseout="hoveredItem = null"
                @click="focusedItem = item"
              >
                <div class="h-[20px] w-full flex flex-row items-center py-[1px]">
                  <div class="grid mr-[1px] h-full w-5 place-items-center border-b border-[#C8C8C8] rounded-t-[2px] bg-[#925213] text-[12px]">
                    {{ item.getType() }}
                  </div>
                  <template v-if="item.getType() === 'A'">
                    <div
                      v-for="value, itemIdx in item.values"
                      :key="itemIdx"
                      class="h-full flex items-center px-[1px]"
                    >
                      <n-checkbox v-if="itemIdx === 3 || itemIdx === 4" :focusable="false" :checked="Boolean(value)" @click="onEllipticalArcChange(idx, itemIdx)" />
                      <input
                        v-else
                        :value="parseFloat(value.toFixed(4)).toString()"
                        type="text"
                        class="block h-full w-[38px] border-b-[1px] border-[#C8C8C8] rounded-t-[2px] bg-[#454545] text-center text-[10px] outline-none hover:border-[#f5f6fa]"
                        @input="e => updateCommandValue(e, item, itemIdx)"
                      >
                    </div>
                  </template>
                  <template v-else>
                    <div
                      v-for="value, itemIdx in item.values"
                      :key="itemIdx"
                      class="h-full flex items-center px-[1px]"
                    >
                      <input
                        :value="parseFloat(value.toFixed(4)).toString()"
                        type="text"
                        class="block h-full w-[38px] border-b-[1px] border-[#C8C8C8] rounded-t-[2px] bg-[#454545] text-center text-[10px] outline-none hover:border-[#f5f6fa]"
                        @input="e => updateCommandValue(e, item, itemIdx)"
                      >
                    </div>
                  </template>
                </div>
                <CommandTool :disable-delete="idx === 0" @operate="(type: string) => onClickOperate(type, item)" />
              </div>
            </template>
          </n-collapse-item>
        </n-collapse>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.hovered {
  background-color: #37373d;
}
.dragged {
  background-color: #094771;
}
:deep(.n-collapse-item > .n-collapse-item__content-wrapper > .n-collapse-item__content-inner) {
  padding: 2px 0px;
}
:deep(.n-collapse-item > .n-collapse-item__header) {
  padding: 0;
}
:deep(.n-collapse-item > .n-collapse-item__header > .n-collapse-item__header-main) {
  background-color: #383838;
  padding: 1px 4px;
}

::-webkit-scrollbar {
  display: none;
}
.trapezoid {
  width: 56px;
  height: 18px;
  transform: rotate(90deg);
  right: -37px;
  top: 50%;
  background: #252526;
  border-top-left-radius: 24px 30px;
  border-top-right-radius: 24px 30px;
  cursor: pointer;
}
.trapezoid::after {
  content: '';
  position: absolute;
  left: 23%;
  top: 45%;
  width: 30px;
  height: 3px;
  border-radius: 20px;
  background-color: #135200;
}

@keyframes slideInFromLeft {
  from {
    opacity: 1;
    transform: translateX(0);
    width: 320px;
  }
  to {
    opacity: 0;
    transform: translateX(-100%);
    overflow: hidden;
    width: 0;
  }
}

.transition-fade-enter-active {
  animation: slideInFromLeft 0.2s ease-out;
}

.transition-fade-leave-active {
  animation: slideInFromLeft 0.2s ease-out;
}
</style>
