export const isDark = useDark({
  storageKey: 'theme-appearance',
  selector: 'html',
})
export const toggleDark = useToggle(isDark)
export const preferredDark = usePreferredDark()

export function clickToggleDark(e: MouseEvent) {
  const isAppearanceTransition = document.startViewTransition

  if (!isAppearanceTransition) {
    isDark.value = !isDark.value
    return
  }

  const x = e.clientX
  const y = e.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]

    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
