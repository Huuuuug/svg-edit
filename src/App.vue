<script setup lang="ts">
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
  <main font-sans text="center gray-700 dark:gray-200">
    <RouterView />
    <!-- <TheFooter /> -->
  </main>
</template>
