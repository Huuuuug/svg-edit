import type { CSSObject, Rule } from 'unocss'
import type { Theme } from '@unocss/preset-mini'
import { handler } from '@unocss/preset-mini/utils'
import animatedJSON from './animated.json'
import animatedExtraJSON from './extra-animated.json'

const json = {
  ...animatedJSON,
  ...animatedExtraJSON,
}

function getAnimated() {
  return animatedJSON as unknown as {
    [key: string]: {
      animationName: string
      css: CSSObject
      keyframes: string
    }
  }
}

export const durationShortcuts = {
  faster: 0.5,
  fast: 0.8,
  slow: 2,
  slower: 3,
}

const animatedRules: Rule<Theme>[] = [
  ['animated', {
    'animation-duration': '1s',
    'animation-fill-mode': 'both',
  }],
  [
    /^animated-(((fast|slow)(?:er)?)|duration-(none|(\d+(\.\d+)?(m?s)?)))/,
    ([_, , shortcut, , v]) => {
      if (shortcut) {
        return {
          'animation-duration': `calc(var(--une-animated-duration) * ${durationShortcuts[shortcut as keyof typeof durationShortcuts]});`,
        }
      }

      return {
        'animation-duration': v === 'none' ? '0ms' : handler.bracket.cssvar.time(v),
      }
    },
    {
      autocomplete: [
        `animated-(${Object.keys(durationShortcuts).join('|')})`,
        'animated-duration-none',
        'animated-duration-$duration',
      ],
    },
  ],
  [
    new RegExp(`^animated-(${Object.keys(json).join('|')})$`),
    ([, name]) => {
      const { animationName, css, keyframes } = getAnimated()[name]

      return [
        `@keyframes ${animationName} { ${keyframes} }`,
        css,
      ]
    },
    {
      autocomplete: [`animated-${Object.keys(json).join('|')}`],
    },
  ],
]

export default animatedRules
