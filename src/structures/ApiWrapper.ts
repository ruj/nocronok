import { IApiWrapperOptions, IOptionHandler } from '@interfaces'
import { optionHandler } from '@utils'

export default class ApiWrapper {
  private apiOptions: IOptionHandler
  public name: string
  public baseUrl: string
  public envVars?: string[]

  constructor (options: IApiWrapperOptions) {
    this.apiOptions = optionHandler('ApiWrapper', options)

    this.name = this.apiOptions.required('name')
    this.baseUrl = this.apiOptions.required('baseUrl')
    this.envVars = this.apiOptions.optional('envVars')
  }

  public load () {
    return this
  }

  public buildQuery (parameters: { [key: string]: any }) {
    return Object.entries(parameters)
      .map((parameter) => parameter.join('='))
      .join('&')
  }
}
