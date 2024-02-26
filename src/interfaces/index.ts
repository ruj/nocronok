export * from './api'
export * from './command'
export * from './file'
export * from './listener'
export * from './option'
export * from './route'
export * from './steam'

export interface IOptionHandler<Type> {
  default: <Key extends keyof Type, Value extends Type[Key]>(
    name: Key,
    defaultValue: Value
  ) => Type[Key]
  optional: <Key extends keyof Type>(name: Key) => Type[Key] | null
  required: <Key extends keyof Type>(name: Key) => Type[Key]
}
