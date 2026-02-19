import { ScenarioMeta } from '@/modules/typescapes/model.iso'
import typistFundamentals from './typist-fundamentals/meta'
import enumGuards from './enum-guards/meta'
import nestedProps from './nested-props/meta'
import registryBuilder from './registry-builder/meta'

export default [
  typistFundamentals,
  enumGuards,
  nestedProps,
  registryBuilder
] as const satisfies readonly ScenarioMeta[]