import { ICommandOptions } from 'interfaces/command'
import sample from 'lodash/sample'

import { IListenerOptions, IOptionHandler, IRouteOptions } from '@interfaces'

export const optionHandler = (
  structure: string,
  options: ICommandOptions | IListenerOptions | IRouteOptions
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
