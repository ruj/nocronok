import { type IApiWrapperOptions, type IOptionHandler } from '@interfaces'
import { optionHandler } from '@utils'

export default class ApiWrapper {
  private readonly apiOptions: IOptionHandler<IApiWrapperOptions>
  public name: string
  public baseUrl: string
  public envVars?: string[] | null | undefined

  constructor (options: IApiWrapperOptions) {
    this.apiOptions = optionHandler('ApiWrapper', options)

    this.name = this.apiOptions.required('name')
    this.baseUrl = this.apiOptions.required('baseUrl')
    this.envVars = this.apiOptions.optional('envVars')
  }

  public load (): this {
    return this
  }

  public buildQuery (parameters: Record<string, any>): string {
    return Object.entries(parameters)
      .map((parameter) => parameter.join('='))
      .join('&')
  }
}
