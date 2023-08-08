import { Request, Response } from 'express'

import { IRouteOptions } from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import Route from '@structures/Route'

export default class Ok extends Route {
  constructor (client: Nocronok, options: IRouteOptions) {
    super(client, {
      ...options,
      endpoints: [{ method: 'GET', path: '/' }]
    })
  }

  public handler (request: Request, response: Response) {
    return response.sendStatus(200)
  }
}
