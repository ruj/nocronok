import camelCase from 'lodash/camelCase'
import isArray from 'lodash/isArray'
import isObject from 'lodash/isObject'
import sample from 'lodash/sample'
import transform from 'lodash/transform'

import {
  IApiWrapperOptions,
  ICommandOptions,
  IListenerOptions,
  IOptionHandler,
  IRouteOptions
} from '@interfaces'

type CamelizeObject = {
  [key: string]: any
}

export const camelize = (object: CamelizeObject): CamelizeObject =>
  transform(object, (accumulator, currentValue, key, target) => {
    const camelKey = !isArray(target) ? camelCase(key as string) : key
    const value = isObject(currentValue) ? camelize(currentValue) : currentValue

    ;(accumulator as any)[camelKey] = value
  })

export const optionHandler = (
  structure: string,
  options:
    | IApiWrapperOptions
    | ICommandOptions
    | IListenerOptions
    | IRouteOptions
): IOptionHandler => ({
  default (name: string, defaultValue: any | any[]): any {
    const value = options[name as keyof typeof options]

    return typeof value === 'undefined'
      ? Array.isArray(defaultValue)
        ? sample(defaultValue)
        : defaultValue
      : value
  },
  optional (name: string): any | null {
    return options[name as keyof typeof options] || null
  },
  required (name: string) {
    const value = options[name as keyof typeof options]

    if (typeof value === 'undefined') {
      throw new Error(
        `The "${name}" option in the ${structure} structure is required`
      )
    }

    return value
  }
})
