import express, { Express } from 'express'

import { IRouteEndpoint } from '@interfaces'
import type Nocronok from '@structures/base/Nocronok'
import Loader from '@structures/Loader'

export default class HTTPLoader extends Loader {
  public http: Express

  constructor (client: Nocronok) {
    super(client)

    this.http = express()
  }

  public load () {
    this.initializeHTTPServer()

    return this.loadFiles('http')
  }

  public loadFile (Route: any, name: string, parent: string) {
    const route = new Route(this.client, { name })

    if (!route.endpoints?.length) return false

    route.endpoints?.forEach(({ method, path, handler }: IRouteEndpoint) => {
      const toLowerCase = <T extends string>(value: T) =>
        value.toLowerCase() as Lowercase<T>

      route.router[toLowerCase(method)](path, (...variables: unknown[]) =>
        route[handler ?? 'handler'](...variables)
      )

      this.http.use(
        `/${parent}/${route.name}${!path.startsWith('/') ? `/${path}` : path}`,
        route.router
      )
    })
  }

  private initializeHTTPServer (port = process.env.PORT) {
    if (!port) {
      return this.logger.warn(
        { labels: ['HTTPLoader'] },
        'Server not started - Environment variable "PORT" is not set'
      )
    }

    this.http.use(express.json())

    this.http.listen(port, () =>
      this.logger.info({ labels: ['HTTPLoader'] }, `Listening on port ${port}`)
    )
  }
}
