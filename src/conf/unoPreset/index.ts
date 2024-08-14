import type { Preset } from 'unocss'
import animatedRules from './rules/animated'

export function presetExtra(): Preset {
  return {
    name: 'unocss-preset-extra',
    rules: [
      ...animatedRules,
    ],
  }
}
