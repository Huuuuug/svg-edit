import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetUno,
  presetWebFonts,
} from 'unocss'
import { presetExtra } from './src/conf/unoPreset'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
      warn: true,
      extraProperties: {
        'display': 'inline-block',
        'vertical-align': 'middle',
      },
    }),
    presetWebFonts({
      fonts: {
        sans: 'DM Sans',
        serif: 'DM Serif Display',
        mono: 'DM Mono',
      },
    }),
    presetExtra(),

  ],
  shortcuts: [],
  rules: [],
  preflights: [
    {
      getCSS: () => `
        .n-button {
          background-color: var(--n-color)
        }
      `,
    },
  ],
})
