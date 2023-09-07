export * from './api'
export * from './command'
export * from './file'
export * from './listener'
export * from './option'
export * from './route'

export interface IOptionHandler {
  default: (name: string, defaultValue: any | any[]) => any
  optional: (name: string) => any | null
  required: (name: string) => any
}
