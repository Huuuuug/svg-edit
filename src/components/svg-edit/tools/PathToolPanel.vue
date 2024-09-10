<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import type { SvgItem } from '../core/Svg'
import { useComposition } from '../core/composition'
import AppendNewCommand from './AppendNewCommand.vue'
import { useSvgPathStore } from '~/stores/svg-path'

const { rawPath, parsedPath, hoveredItem, foucusedItem } = storeToRefs(useSvgPathStore())
const { reloadPath } = useComposition()

const defaultExpandedNames = ref(['path', 'commands'])

function updateCommandValue(e: any, item: SvgItem, idx: number) {
  const val = Number((e.target as any)?.value)
  if (!Number.isNaN(val)) {
    item.values[idx] = Number(val)
    parsedPath.value!.refreshAbsolutePositions()
    rawPath.value = parsedPath.value?.asString(4, false)
  }
}

function handleClearPath() {
  foucusedItem.value = null
  reloadPath('', false)
}

function onClickOperate(type: string, item: SvgItem) {
  if (type === 'delete') {
    const idx = parsedPath.value?.path.indexOf(item)
    if (idx !== -1) {
      parsedPath.value?.delete(item)
      if (item === foucusedItem.value)
        foucusedItem.value = null
    }
  }
}

watch(() => parsedPath.value?.path, () => {
  rawPath.value = parsedPath.value?.asString(4, false)
}, { deep: true })
</script>

<template>
  <div class="h-full w-full overflow-y-auto bg-[#252526] p-1">
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
      <n-collapse-item title="CONFIGURATION" name="configration" />
      <n-collapse-item title="COMMANDS" name="commands">
        <template v-for="item, idx in parsedPath?.path" :key="item">
          <div
            class="w-full flex flex-row items-center justify-between"
            :class="{ 'bg-[#3B3B3C70]': hoveredItem === item && foucusedItem !== item, 'bg-[#2C978030]': foucusedItem === item }"
            @mouseenter="hoveredItem = item"
            @mouseout="hoveredItem = null"
            @click="foucusedItem = item"
          >
            <div class="h-6 w-full flex flex-row items-center py-[1px]">
              <div class="grid mr-[1px] w-5 place-items-center rounded-t-[2px] bg-[#925213]">
                {{ item.getType() }}
              </div>
              <div
                v-for="value, idx in item.values"
                :key="idx"
                class="h-full w-[38px] px-[1px]"
              >
                <input
                  :value="parseFloat(value.toFixed(4)).toString()"
                  type="text"
                  class="block h-full w-full border-b-[1px] border-[#C8C8C8] rounded-t-[2px] bg-[#454545] text-center text-[10px] outline-none hover:border-[#f5f6fa]"
                  @input="e => updateCommandValue(e, item, idx)"
                >
              </div>
            </div>
            <CommandTool :disable-delete="idx === 0" @operate="(type: string) => onClickOperate(type, item)" />
          </div>
        </template>
      </n-collapse-item>
    </n-collapse>
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
</style>
