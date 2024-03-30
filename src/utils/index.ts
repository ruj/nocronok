import camelCase from 'lodash/camelCase'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import transform from 'lodash/transform'

import type { IOptionHandler } from '@interfaces'

type SnakeToCamel<Type extends Record<string, any>> = {
  [Key in keyof Type as Uncapitalize<string & Key>]: Type[Key]
}

export const blank = (length: number = 1): string => '\xa0'.repeat(length)

export const camelize = <Type extends Record<string, any>>(
  object: Type
): SnakeToCamel<Type> =>
  transform(object, (accumulator, currentValue, key, target) => {
    const camelKey = !isArray(target) ? camelCase(key) : key
    const value = isObject(currentValue) ? camelize(currentValue) : currentValue

    ;(accumulator as any)[camelKey] = value
  })

export const optionHandler = <Type>(
  structure: string,
  options: Type
): IOptionHandler<Type> => ({
  default<Key extends keyof Type, Value extends Type[Key]> (
    name: Key,
    defaultValue: Value
  ): Type[Key] {
    const value = options[name]

    if (typeof value !== 'undefined') {
      return value
    }

    return defaultValue
  },
  optional<Key extends keyof Type> (name: Key): Type[Key] | null {
    return options[name] ?? null
  },
  required<Key extends keyof Type> (name: Key): Type[Key] {
    const value = options[name]

    if (typeof value === 'undefined') {
      throw new Error(
        `The "${String(name)}" option in the ${structure} structure is required`
      )
    }

    return value
  }
})

export const pluralize = (
  condition: boolean,
  plural: string = 's',
  singular: string = ''
): string => {
  return condition ? plural : singular
}
