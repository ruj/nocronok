import { IApiWrapperOptions, IOptionHandler } from '@interfaces'
import { optionHandler } from '@utils'

export default class ApiWrapper {
  private apiOptions: IOptionHandler
  public name: string
  public baseUrl: string

  constructor (options: IApiWrapperOptions) {
    this.apiOptions = optionHandler('ApiWrapper', options)

    this.name = this.apiOptions.required('name')
    this.baseUrl = this.apiOptions.required('baseUrl')
  }

  public load () {
    return this
  }
}
