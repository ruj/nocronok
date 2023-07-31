export * from './file'
export * from './listener'

export interface IOptionHandler {
  default: (name: string, defaultValue: any | any[]) => any
  optional: (name: string) => any | null
  required: (name: string) => any
}
