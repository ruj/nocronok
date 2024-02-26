import { type Request, type Response } from 'express'

import { type IRouteOptions } from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import Route from '@structures/Route'

export default class Ok extends Route {
  constructor (client: Nocronok, options: IRouteOptions) {
    super(client, {
      ...options,
      endpoints: [{ method: 'GET', path: '/' }]
    })
  }

  public handler (
    request: Request,
    response: Response
  ): Response<any, Record<string, any>> {
    return response.sendStatus(200)
  }
}
