<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import type { SvgItem } from './Svg'
import { useSvgPathStore } from '~/stores/svg-path'

const { rawPath, parsedPath, hoveredItem, foucusedItem } = storeToRefs(useSvgPathStore())

const defaultExpandedNames = ref(['path', 'commands'])

function updateCommandValue(e: any, item: SvgItem, idx: number) {
  const val = Number((e.target as any)?.value)
  if (!Number.isNaN(val)) {
    item.values[idx] = Number(val)
    parsedPath.value!.refreshAbsolutePositions()
    rawPath.value = parsedPath.value?.asString(4, false)
  }
}

watch(() => parsedPath.value?.path, () => {
  rawPath.value = parsedPath.value?.asString(4, false)
}, { deep: true })
</script>

<template>
  <div class="h-full w-full bg-[#252526] p-1">
    <n-collapse arrow-placement="right" :default-expanded-names="defaultExpandedNames">
      <n-collapse-item title="PATH" name="path">
        <n-input
          v-model:value="rawPath"
          type="textarea"
          placeholder="Textarea"
          :rows="6"
        />
      </n-collapse-item>
      <n-collapse-item title="COMMANDS" name="commands">
        <template v-for="item in parsedPath?.path" :key="item">
          <div
            class="w-full flex flex-row items-center justify-between"
            :class="{ 'bg-[#3B3B3C70]': hoveredItem === item && foucusedItem !== item, 'bg-[#2C978030]': foucusedItem === item }"
            @mouseenter="hoveredItem = item"
            @mouseout="hoveredItem = null"
            @click="foucusedItem = item"
          >
            <div class="h-6 w-full flex flex-row items-center py-[1px]">
              <div class="grid mr-[1px] w-6 place-items-center rounded-t-[2px] bg-[#925213]">
                {{ item.getType() }}
              </div>
              <div
                v-for="value, idx in item.values"
                :key="idx"
                class="h-full w-10 px-[1px]"
              >
                <input
                  :value="parseFloat(value.toFixed(4)).toString()"
                  type="text"
                  class="block h-full w-full border-b-[1px] border-[#C8C8C8] rounded-t-[2px] bg-[#454545] text-center text-[10px] outline-none"
                  @input="e => updateCommandValue(e, item, idx)"
                >
              </div>
            </div>
            <div class="cursor-pointer" i="carbon-overflow-menu-horizontal" />
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
</style>
