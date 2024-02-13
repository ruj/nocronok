import camelCase from 'lodash/camelCase'
import snakeCase from 'lodash/snakeCase'
import upperFirst from 'lodash/upperFirst'

export type CaseFunction = (string: string, toUpperCase?: boolean) => string

export default class EnumUtils {
  static convertCase<Type extends Record<string, string>> (
    enumObject: Type,
    convertFunction: CaseFunction,
    toUpperCase?: boolean
  ): Type {
    const convertedEnum: Partial<Type> = {}

    for (const key in enumObject) {
      if (Object.prototype.hasOwnProperty.call(enumObject, key)) {
        const originalValue = enumObject[key as keyof Type]
        const convertedValue = convertFunction(originalValue, toUpperCase)

        convertedEnum[key as keyof Type] = convertedValue as any
      }
    }

    return convertedEnum as Type
  }

  static toSnake (string: string, toUpperCase?: boolean): string {
    const result = snakeCase(string)

    return toUpperCase ?? true ? result.toUpperCase() : result.toLowerCase()
  }

  static toCamel (string: string): string {
    return camelCase(string)
  }

  static toPascal (string: string): string {
    return upperFirst(camelCase(string))
  }
}
