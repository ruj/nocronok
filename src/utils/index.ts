import sample from 'lodash/sample'

import {
  IListenerOptions,
  IOptionHandler
} from '@interfaces'

export const optionHandler = (
  structure: string,
  options: IListenerOptions
): IOptionHandler => ({
  default (name: string, defaultValue: any | any[]): any {
    const value = options[name]

    return typeof value === 'undefined'
      ? Array.isArray(defaultValue)
        ? sample(defaultValue)
        : defaultValue
      : value
  },
  optional (name: string): any | null {
    return options[name] || null
  },
  required (name: string) {
    const value = options[name]

    if (typeof value === 'undefined') {
      throw new Error(
        `The "${name}" option in the ${structure} structure is required`
      )
    }

    return value
  }
})
