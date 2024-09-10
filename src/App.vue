<script setup lang="ts">
import { NConfigProvider, darkTheme } from 'naive-ui'
import themeOverrides from '~/conf/naiveTheme'

useHead({
  title: 'Svg Icon Edit',
  meta: [
    { name: 'description', content: 'Opinionated Vite Starter Template' },
    {
      name: 'theme-color',
      content: computed(() => isDark.value ? '#00aba9' : '#ffffff'),
    },
  ],
  link: [
    {
      rel: 'icon',
      type: 'image/svg+xml',
      href: computed(() => preferredDark.value ? '/favicon-dark.svg' : '/favicon.svg'),
    },
  ],
})
</script>

<template>
  <NConfigProvider :theme="darkTheme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <main font-roboto text="center gray-700 dark:gray-200">
        <RouterView />
      </main>
    </n-message-provider>
  </NConfigProvider>
</template>
