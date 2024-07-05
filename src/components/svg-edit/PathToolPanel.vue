<script setup lang='ts'>
import { storeToRefs } from 'pinia'
import { useSvgPathStore } from '~/stores/svg-path'
import { symbolFn } from '~/utils'

const { rawPath, parsedPath } = storeToRefs(useSvgPathStore())

const defaultExpandedNames = ref(['path', 'configuration', 'commands'])
</script>

<template>
  <div class="h-full w-full bg-[#252526] p-2">
    <n-collapse arrow-placement="right" :default-expanded-names="defaultExpandedNames">
      <n-collapse-item title="PATH" name="path">
        <n-input
          v-model:value="rawPath"
          type="textarea"
          placeholder="基本的 Textarea"
          :rows="6"
        />
      </n-collapse-item>
      <n-collapse-item title="CONFIGURATION" name="configuration">
        <div>很好</div>
      </n-collapse-item>
      <n-collapse-item title="COMMANDS" name="commands">
        <template v-for="item in parsedPath?.path" :key="symbolFn(item)">
          <div class="w-full flex flex-row items-center justify-between">
            <div class="h-6 w-full flex flex-row items-center py-[1px]">
              <div class="grid w-6 place-items-center rounded-[3px] bg-[#925213]">
                {{ item.getType() }}
              </div>
              <div
                v-for="value, idx in item.values"
                :key="symbolFn(idx)"
                class="h-full w-8 px-[1px]"
              >
                <input type="text" :value="value" class="block h-full w-full rounded-[3px] bg-[#454545] text-center text-[12px] outline-none">
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
</style>
