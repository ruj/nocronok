import { Request, Response } from 'express'

import Route from '@structures/Route'

export default class Ok extends Route {
  constructor (client, options) {
    super(client, {
      ...options,
      endpoints: [{ method: 'GET', path: '/', handler: 'ok' }]
    })
  }

  public ok (request: Request, response: Response) {
    return response.sendStatus(200)
  }
}
