import { Router } from 'express'
import type { Logger } from 'pino'

import {
  type IOptionHandler,
  type IRouteEndpoint,
  type IRouteOptions
} from '@interfaces'
import { optionHandler } from '@utils'

import type Nocronok from './base/Nocronok'

export default class Route {
  private readonly routeOptions: IOptionHandler<IRouteOptions>
  public client: Nocronok
  public logger: Logger
  public name: string
  public endpoints: IRouteEndpoint[]
  public router: Router

  constructor (client: Nocronok, options: IRouteOptions) {
    this.client = client
    this.logger = client.logger

    this.routeOptions = optionHandler('Route', options)

    this.name = this.routeOptions.required('name')
    this.endpoints = this.routeOptions.required('endpoints')

    this.router = Router()
  }
}
