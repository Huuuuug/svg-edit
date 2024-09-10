<script setup lang='ts'>
import type { DropdownOption } from 'naive-ui'

const props = withDefaults(defineProps<{
  disableDelete?: boolean
}>(), {
  disableDelete: false,
})

const emits = defineEmits<{
  (e: 'operate', type: string): void
}>()

const isOperateModalVisible = ref(false)

const operations = computed<DropdownOption[]>(() => [
  {
    key: 'insert',
    label: 'Insert After',
    icon: () => h('i', { class: 'i-carbon:add-filled' }),
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
</script>

<template>
  <n-dropdown
    placement="bottom-start"
    :options="operations"
    :show="isOperateModalVisible"
    :on-clickoutside="() => isOperateModalVisible = false"
    :on-select="(key:string) => emits('operate', key)"
  >
    <div class="h-4 w-[4px] w-4 flex items-center justify-center rounded-full hover:bg-[#135200]" @click="isOperateModalVisible = true">
      <div class="cursor-pointer" i="carbon-overflow-menu-horizontal" />
    </div>
  </n-dropdown>
</template>

<style scoped>
</style>
