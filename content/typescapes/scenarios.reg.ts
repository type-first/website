import { ScenarioMeta } from '@/modules/typescapes/model.iso'
import enumGuards from './enum-guards/meta'
import nestedProps from './nested-props/meta'

export default [
  enumGuards,
  nestedProps
] as const satisfies readonly ScenarioMeta[]